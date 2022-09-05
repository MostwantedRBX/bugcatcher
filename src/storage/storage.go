package storage

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
)

var (
	//	Connection data is retrieved from enviroment variables
	pgHost         = os.Getenv("PG_HOST")
	pgPort, _      = strconv.Atoi(os.Getenv("PG_PORT"))
	pgPass         = os.Getenv("PG_PASS")
	pgDatabaseName = os.Getenv("PG_DATABASE_NAME")
)

//	Struct is used for keeping all of the user's info/potential info orginized.
type User struct {
	Email        string    `json:"email"`
	Username     string    `json:"username"`
	Password     string    `json:"password"`
	Hash         string    `json:"hash"`
	Token        string    `json:"token"`
	Token_Expiry time.Time `json:"token_expiry"`
}

//	Creates the table to store urls with a string as the key if it doesn't exist.
func initializeDB(db *sql.DB) error {
	db.SetMaxOpenConns(200)
	db.SetMaxIdleConns(50)

	statement, err := db.Prepare(`--sql
		CREATE TABLE IF NOT EXISTS users(
			email TEXT,
			username TEXT,
			hash TEXT, 
			PRIMARY KEY (email)
		);
	`)

	if err != nil {
		log.Logger.Fatal().Err(err).Msg("")
		return err
	}

	_, err = statement.Exec()
	if err != nil {
		log.Logger.Fatal().Err(err).Msg("")
		return err
	}

	statement, err = db.Prepare(`--sql
		CREATE TABLE IF NOT EXISTS session_tokens(
			session_token TEXT,
			session_expiry TIMESTAMP,
			fk_email TEXT,
			PRIMARY KEY(session_token),
			CONSTRAINT fk_user
				FOREIGN KEY(fk_email)
					REFERENCES users(email)
		);
	`)

	if err != nil {
		log.Logger.Fatal().Err(err).Msg("")
		return err
	}

	_, err = statement.Exec()
	if err != nil {
		log.Logger.Fatal().Err(err).Msg("")
		return err
	}

	return nil
}

//	StartDB opens the sql connection.
//	Returns an sql.DB object.
func StartDB() *sql.DB {
	//	Open initial connection to database
	db, err := sql.Open("postgres", fmt.Sprintf("host= %s port= %d user= postgres password= %s dbname= %s sslmode= disable", pgHost, pgPort, pgPass, pgDatabaseName))
	if err != nil {
		log.Logger.Fatal().Err(err).Msg("")
	}
	err = initializeDB(db)

	count := 0
	for err != nil {
		err = initializeDB(db)
		count++
		if count > 5 {
			panic("Could not connect to db")
		}
		time.Sleep(5 * time.Second)
	}

	log.Logger.Info().Caller().Msg("Database opened and initialized")
	return db
}

//	Creates user in DB by checking whether the email already exists, if it
//	doesn't, create a password hash and inserting it and the email into the DB.
func CreateUser(db *sql.DB, usr User) (bool, error) {
	if _, err := GetUserInfo(db, usr.Email); err == nil {
		return true, nil
	}

	statement, err := db.Prepare("INSERT INTO users(email, username, hash) VALUES ($1, $2, $3);")
	if err != nil {
		return false, err
	}

	usr.Hash, err = HashPass(usr.Password)
	if err != nil {
		return false, err
	}

	_, err = statement.Exec(usr.Email, usr.Username, usr.Hash)
	if err != nil {
		return false, err
	}

	//	This is purely to keep the fields from being null. I know it isn't good practice. With the expiry set to current time, it will require the account to relog
	statement, err = db.Prepare("INSERT INTO session_tokens(session_token, session_expiry, fk_email) VALUES ($1, current_timestamp, $2);")
	if err != nil {
		return false, err
	}

	usr, err = NewUserSessionToken(db, usr)
	if err != nil {
		return false, err
	}

	_, err = statement.Exec(usr.Token, usr.Email)
	if err != nil {
		return false, err
	}

	return false, nil
}

//	Retrieves user info from the database and returns a user struct,
//	returns an error of the user is not in the database.
func GetUserInfo(db *sql.DB, requestedEmail string) (User, error) {
	rows, err := db.Query("SELECT email, username, hash FROM users WHERE email=$1;", requestedEmail)
	if err != nil {
		return User{}, err
	}

	var usr User
	for rows.Next() {
		err := rows.Scan(&usr.Email, &usr.Username, &usr.Hash)
		if err != nil {
			return User{}, err
		}
		if requestedEmail == usr.Email {
			return usr, nil
		}
	}
	return User{}, errors.New("could not find email in db")
}

//	Basically the equivelent to GetUserInfo above, but this uses the token that
//	has a foreign key linking it to the user's info in the database.
func GetUserInfoTkn(db *sql.DB, token string) (User, error) {
	rows, err := db.Query("SELECT email, username, hash, session_token, session_expiry FROM users JOIN session_tokens ON users.email=session_tokens.fk_email WHERE session_token=$1;", token)
	if err != nil {
		return User{}, err
	}

	var usr User
	for rows.Next() {
		err := rows.Scan(&usr.Email, &usr.Username, &usr.Hash, &usr.Token, &usr.Token_Expiry)
		if err != nil {
			return User{}, err
		}
		if token == usr.Token && usr.Token_Expiry.After(time.Now().UTC()) {
			log.Logger.Debug().Msg("Found user from session token")
			return usr, nil
		}
	}
	return User{}, errors.New("could not find token in db")
}

// Various DB updating methods

//	Function is used for updating the user's password.
func UpdateUserHash(db *sql.DB, usr User) error {
	_, err := db.Exec("UPDATE users SET hash=$2 WHERE email=$1;", usr.Email, usr.Hash)
	if err != nil {
		return err
	}
	return nil
}

//	Creates a new user session token with a expiry time and stores it in the DB, returns a User struct with the new token
func NewUserSessionToken(db *sql.DB, usr User) (User, error) {
	usr.Token_Expiry = time.Now().UTC().Add(time.Hour * time.Duration(1))
	usr.Token = uuid.NewString()
	log.Logger.Debug().Msg("email: " + usr.Email + " tkn:" + usr.Token + " exp:" + usr.Token_Expiry.String())
	_, err := db.Exec("UPDATE session_tokens SET session_token=$2, session_expiry=$3 WHERE fk_email=$1;", usr.Email, usr.Token, usr.Token_Expiry)
	if err != nil {
		return User{}, err
	}
	return usr, nil
}

//	Takes a User struct and validates the user's token against the token in the database. Returns true if they match, false otherwise.
func CheckToken(db *sql.DB, usr User) (bool, error) {
	dbUser, err := GetUserInfo(db, usr.Email)
	if err != nil {
		return false, err
	}

	if dbUser.Token == usr.Token && len(usr.Token) > 0 {
		return true, nil
	}
	return false, nil
}

//	Creates a hash from a string(most likely a password) using bcrypts GenerateFromPassword() function
//	with a complexity of 8, that number being arbitrarily picked by me.
func HashPass(raw string) (string, error) {
	if hashed, err := bcrypt.GenerateFromPassword([]byte(raw), 8); err == nil {
		return string(hashed), nil
	}
	return "", errors.New("could not hash password")
}

//	Checks whether or not a hash/password combo are valid, returns error if it is not valid.
func CheckPass(usr User) error {
	if bcrypt.CompareHashAndPassword([]byte(usr.Hash), []byte(usr.Password)) == nil {
		return nil
	}
	return errors.New("no match in password/hash comparison")
}

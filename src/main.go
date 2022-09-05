package main

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/acme/autocert"

	"github.com/mostwantedrbx/bugcatcher/storage"
)

var (
	DB      *sql.DB = storage.StartDB()
	PROD    bool    = os.Getenv("PROD") == "true"
	HOSTURL string  = "https://TBD.maybe/" // TODO: Change to proper domain before deployment.
)

func userInfoAPI(w http.ResponseWriter, req *http.Request) {
	var usr storage.User
	if err := json.NewDecoder(req.Body).Decode(&usr); err != nil {
		log.Logger.Err(err).Msg("Could not decode json")
		http.Error(w, err.Error(), 500)
		return
	}
	log.Logger.Debug().Msg(usr.Token)
	usrInfo, err := storage.GetUserInfoTkn(DB, usr.Token)
	if err != nil {
		log.Logger.Err(err).Msg("Could find user")
		w.WriteHeader(404)
	}

	json.NewEncoder(w).Encode(usrInfo)
}

//	Tries to get the user's info and if it doest find it, writes a 404 to the page header, otherwise
//	it compares the password in the request to the hash in the database for that user.
//	If it is correct it writes a cookie with a session token to the user's browser.
func login(w http.ResponseWriter, req *http.Request) {
	var usr storage.User
	if err := json.NewDecoder(req.Body).Decode(&usr); err != nil {
		log.Logger.Err(err).Msg("Could not decode json")
		http.Error(w, err.Error(), 500)
		return
	}

	usrInfo, err := storage.GetUserInfo(DB, usr.Email)
	if err != nil {
		log.Logger.Err(err).Msg("Could find user")
		w.WriteHeader(404)
	}

	usr.Hash = usrInfo.Hash
	if err := storage.CheckPass(usr); err == nil {
		//	if user has the correct password . . .

		usr, err = storage.NewUserSessionToken(DB, usr)
		if err != nil {
			log.Logger.Err(err).Msg("hash/pass combo incorrect")
			w.WriteHeader(500)
			return
		}
		http.SetCookie(w, &http.Cookie{
			Name:    "session",
			Path:    "/",
			Value:   usr.Token,
			Expires: usr.Token_Expiry,
		})

		w.WriteHeader(200)
		return
	}
	log.Logger.Err(err).Msg("hash/pass combo incorrect")
	w.WriteHeader(500)

}

//	Signs up the user by creating a user entry in the database with
//	the function storage.CreateUser(). Writes an http header error
//	on failure or a status of OK if successful.
func signUp(w http.ResponseWriter, req *http.Request) {
	var usr storage.User
	err := json.NewDecoder(req.Body).Decode(&usr)
	if err != nil {
		log.Logger.Err(err).Msg("Could not decode json")
		http.Error(w, err.Error(), 500)
		return
	}

	exists, err := storage.CreateUser(DB, usr)
	if err != nil {
		log.Logger.Err(err)
		http.Error(w, err.Error(), 500)
		return
	} else if exists {
		log.Logger.Info().Msg("User already exists")
		w.WriteHeader(http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func main() {

	//	Log setup
	file, err := os.OpenFile("logs.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, os.FileMode(0666))
	if err != nil {
		panic(err)
	}
	defer file.Close()

	log.Logger = log.Output(io.MultiWriter(zerolog.ConsoleWriter{Out: os.Stderr}, file))
	log.Logger.Info().Msg("Logs started")

	//	Set up a router for our event handlers
	r := mux.NewRouter()

	fs := http.FileServer(http.Dir("./web/"))
	//	Serve /web/index.htm when localhost:8080/ is requested
	r.Handle("/", fs)
	r.HandleFunc("/signup/", signUp).Methods("POST")
	r.HandleFunc("/login/", login).Methods("POST")
	r.HandleFunc("/login/info", userInfoAPI).Methods("POST")
	r.PathPrefix("/").Handler(fs)

	//	Server settings
	m := &autocert.Manager{
		Cache:      autocert.DirCache("/root/secrets"),
		Prompt:     autocert.AcceptTOS,
		Email:      "mostwantedrbxsteam@gmail.com",
		HostPolicy: autocert.HostWhitelist("srtlink.net"),
	}

	server := &http.Server{
		Handler:      r,
		Addr:         ":8080",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	//	Listen @ localhost:80 for a request
	log.Logger.Info().Msg("Starting server @localhost" + server.Addr)
	if PROD {
		server.Addr = ":443"
		server.TLSConfig = m.TLSConfig()
		go func() {
			log.Logger.Fatal().Err(http.ListenAndServe(":http", m.HTTPHandler(nil))).Msg("Server failed to run")
		}()
		log.Logger.Fatal().Err(server.ListenAndServeTLS("", "")).Msg("Server failed to run")
	} else {
		log.Logger.Fatal().Err(server.ListenAndServe()).Msg("Server failed to run")
	}
}

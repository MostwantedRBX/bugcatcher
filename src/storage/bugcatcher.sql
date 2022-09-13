--This file is specifically for mocking out tables/queries

CREATE TABLE IF NOT EXISTS tickets(
  ticket_id INT NOT NULL AUTO_INCREMENT,
  ticket_summary TEXT,
  ticket_submitted TIMESTAMP,
  ticket_completed BOOL,
  ticket_catagory TEXT,
  ticket_creator_email TEXT,
  PRIMARY KEY(ticket_id)
);

CREATE TABLE IF NOT EXISTS ticket_comments(
    comment_id INT NOT NULL AUTO_INCREMENT,
    comment_creator_email TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    fk_ticket_id INT NOT NULL,
    PRIMARY KEY(comment_id),
    CONSTRAINT fk_ticket
        FOREIGN KEY(fk_ticket_id)
            REFERENCES tickets(ticket_id)
)

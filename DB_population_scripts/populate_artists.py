"""
Python Script for Populating Artist in SongApp DB.  Written by Aaron Springer
Assumes following DDL:
    - DDL for SongApp
CREATE TABLE Artist (
    artistID INTEGER NOT NULL AUTO_INCREMENT,
    name CHAR(100),
    PRIMARY KEY(artistID)
);
CREATE TABLE Song (
    songID CHAR(20) NOT NULL,
    title CHAR(100) NOT NULL,
    PRIMARY KEY(songID)
);
CREATE TABLE ListensTo (
    songID CHAR(20) NOT NULL,
    userID CHAR(50) NOT NULL,
    PRIMARY KEY (songID, userID),
    FOREIGN KEY (songID) REFERENCES Song(songID)
);
CREATE TABLE PerformedBy (
    songID CHAR(20) NOT NULL,
    artistID INTEGER NOT NULL,
    PRIMARY KEY (songID, artistID),
    FOREIGN KEY (songID) REFERENCES Song(songID),
    FOREIGN KEY (artistID) REFERENCES Artist(artistID)
);
"""


import os
import json
import mysql.connector
from mysql.connector import errorcode

config = dict(
    user='songapp_master',
    password='songapp450',
    database='songapp_db',
    host='songapp-db.ck7nst26eyeh.us-west-1.rds.amazonaws.com'
)

connection_exists = False

try:
    cnx = mysql.connector.connect(**config)
    connection_exists = True
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with your user name or password")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)


add_performed_by = ("INSERT INTO PerformedBy"
            "(name) "
            "VALUES (%s)")
i = 1

if connection_exists:
    cursor = cnx.cursor()
    f = open('unique_artists.txt', 'r')
    for line in f.xreadlines():
        parts = line.strip().split('<SEP>')
        if len(parts) > 3 and i > 44500:
            artist = parts[3]
            artist_id = parts[0]
            add_artist = "INSERT INTO Artist (artistID, name) VALUES (\"%s\", \"%s\")" % (artist_id, artist)
            print i, add_artist
            try:
                cursor.execute(add_artist)
            except:
                print "Couldn't add ", artist, " to database."
        i = i + 1
    f.close()
    print "committing.."
    cnx.commit()
    cursor.close()
    cnx.close()
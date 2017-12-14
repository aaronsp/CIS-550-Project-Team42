"""
Python Script for Populating PerformedBy in SongApp DB.  Written by Aaron Springer
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

rootdir = 'lastfm_train'

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

add_song = ("INSERT INTO Song"
            "(songID, title) "
            "VALUES (%s, %s)")

add_artist = ("INSERT INTO Artist"
            "(artistID, name) "
            "VALUES (%s, %s)")

add_performed_by = ("INSERT INTO PerformedBy"
                    "(songID, artistID) "
                    "VALUES ")

select_artist_id = ("SELECT artistID "
                    "FROM Artist "
                    "WHERE name = ")
i = 1
if connection_exists:
    cursor = cnx.cursor()
    select_cursor = cnx.cursor()
    for root, subdirs, files in os.walk(rootdir):
        if len(files) > 0:
            for f in files:
                file_path = os.path.join(root, f)
                print i
                with open(file_path) as f:
                    try:
                        d = json.load(f)
                        title = d.get('title')
                        track_id = d.get('track_id')
                        artist = d.get('artist')
                        select_aid = select_artist_id + "\'" + artist + "\'"
                        select_cursor.execute(select_aid)
                        for (aid) in select_cursor:
                            artist_id = aid
                        add_pb = add_performed_by + "(\'" + track_id + "\', \'" + artist_id[0] + "\')"
                        cursor.execute(add_pb)
                    except:
                        print("Data was not json")
                    if i % 500 == 0:
                        print "committing.."
                        cnx.commit()
                i = i + 1
    select_cursor.close()
    cursor.close()
    cnx.close()

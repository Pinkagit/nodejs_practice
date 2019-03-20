#!/usr/bin/env python
# coding=utf-8

import os
import sys
import time
import getpass

process = 'translation-web'

def start():
    os.system("pm2 start app.js")

def stop():
    os.system("pm2 stop app")


def restart():
    os.system("pm2 restart app")

def state():
    os.system('pm2 show app')

def build():
    print(">> --- before build, make sure install necessary packages")
    print(">> --- cd static/vue-translation/")
    print(">> --- npm install")
    os.chdir('static/vue-translation/')
    os.system("npm run build")


def do_action(action):
    if action == 'start':
        start()
    elif action == 'stop':
        stop()
    elif action == 'restart':
        stop()
        start()
    elif action == 'build':
        build()
    else:
        state()
    pass


if __name__ == "__main__":
    opt = sys.argv
    print ">>>> -------------------------------------------"
    if len(opt) == 1:
        print "Usage: "
        print "python run.py [cmd:start/stop/restart/build]"
        exit()

    action = opt[1]
    do_action(action)
    print "<<<< -------------------------------------------"

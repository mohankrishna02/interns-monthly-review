IMPORT FGL details
IMPORT FGL intern
IMPORT FGL mentor
IMPORT FGL trans
DATABASE project
MAIN
    CLOSE WINDOW SCREEN
    OPEN WINDOW HOME WITH FORM "main"
    CALL ui.Interface.loadStyles("mainstyle")
    MENU
        ON ACTION details
            CALL details_fun()
        ON ACTION intern
            CALL intern_fun()
        ON ACTION mentor
            CALL mentor_fun()
        ON ACTION Transaction
            CALL trans_fun()
        ON ACTION EXIT
            EXIT MENU
    END MENU
    CLOSE WINDOW HOME
END MAIN

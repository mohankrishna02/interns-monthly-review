DATABASE project
DEFINE mentor_rec RECORD LIKE mentor.*
DEFINE query_ok SMALLINT
DEFINE match STRING
DEFINE i INT

FUNCTION mentor_fun()

    OPEN WINDOW mentor WITH FORM "mentorper"
    CALL ui.Interface.loadStyles("mentorstyle")
    CALL fun_mentor()

    CLOSE WINDOW mentor
END FUNCTION

FUNCTION fun_mentor()
    DEFINE query_ok SMALLINT

    MENU
        COMMAND "find"
            CLEAR FORM
            CALL mentor_query_cust() RETURNING query_ok
        COMMAND "next"
            IF (query_ok) THEN
                CALL mentor_fetch_rel_cust(1)
            ELSE
                MESSAGE "YOU MUST QUERY FIRST."

            END IF
        COMMAND "previous"
            IF (query_ok) THEN
                CALL mentor_fetch_rel_cust(-1)
            ELSE
                MESSAGE "YOU MUST QUERY FIRST."
            END IF

        ON ACTION ADD
            IF (mentor_fun_input_clg1("A")) THEN
                CALL mentor_insert_cust()
            END IF

        COMMAND "update"
            CALL mentor_update_cust()

        COMMAND "Delete"
            IF (mentor_delete_check()) THEN
                CALL mentor_delete_value()
            END IF
        COMMAND "clear"
            CLEAR FORM
        COMMAND "quit"
            EXIT MENU
    END MENU

END FUNCTION

FUNCTION mentor_query_cust()
    DEFINE
        cont_ok SMALLINT,
        cust_cnt SMALLINT,
        where_clause STRING

    MESSAGE "ENTER SEARCH CRITERIA"
    LET cont_ok = FALSE
    LET int_flag = FALSE

    CONSTRUCT BY NAME where_clause ON mentor.*

    IF (int_flag) = TRUE THEN
        LET int_flag = FALSE
        CLEAR FORM
        LET cont_ok = FALSE
        MESSAGE "CANCELLED BY USER"
    ELSE
        CALL mentor_get_cust_cntm(where_clause) RETURNING cust_cnt
        IF (cust_cnt > 0) THEN
            MESSAGE cust_cnt USING "<<<<", " ROWS FOUND"
            CALL mentor_cust1_select(where_clause) RETURNING cont_ok
        ELSE
            MESSAGE "NO ROWS FOUND"
            LET cont_ok = FALSE
        END IF
    END IF

    IF (cont_ok) THEN
        CALL mentor_display_custm()
    END IF

    RETURN cont_ok

END FUNCTION

FUNCTION mentor_get_cust_cntm(p_where_clause)
    DEFINE
        p_where_clause STRING,
        sql_text STRING,
        cust_cnt SMALLINT

    LET sql_text =
        "SELECT COUNT(*) FROM mentor  WHERE " || p_where_clause CLIPPED

    WHENEVER ERROR CONTINUE
    PREPARE cust_cnt_stmt FROM sql_text
    EXECUTE cust_cnt_stmt INTO cust_cnt
    FREE cust_cnt_stmt
    WHENEVER ERROR STOP

    IF SQLCA.SQLCODE <> 0 THEN
        LET cust_cnt = 0
        ERROR SQLERRMESSAGE
    END IF

    RETURN cust_cnt

END FUNCTION

FUNCTION mentor_cust1_select(p_where_clause)
    DEFINE
        p_where_clause STRING,
        sql_text STRING,
        fetch_ok SMALLINT

    LET sql_text = "SELECT * FROM mentor WHERE " || p_where_clause CLIPPED

    DECLARE cust_curs SCROLL CURSOR WITH HOLD FROM sql_text

    OPEN cust_curs
    CALL mentor_fetch_custm(1) RETURNING fetch_ok
    IF NOT (fetch_ok) THEN
        MESSAGE "NO ROWS IN THE TABLE"
    END IF

    RETURN fetch_ok

END FUNCTION

FUNCTION mentor_fetch_custm(p_fetch_flag)
    DEFINE
        p_fetch_flag SMALLINT,
        fetch_ok SMALLINT

    LET fetch_ok = TRUE
    WHENEVER ERROR CONTINUE
    IF p_fetch_flag = 1 THEN
        FETCH NEXT cust_curs INTO mentor_rec.*
    ELSE
        FETCH PREVIOUS cust_curs INTO mentor_rec.*
    END IF

    CASE
        WHEN (SQLCA.SQLCODE = 0)
            LET fetch_ok = TRUE
        WHEN (SQLCA.SQLCODE = NOTFOUND)
            LET fetch_ok = FALSE
        WHEN (SQLCA.SQLCODE < 0)
            LET fetch_ok = FALSE
            MESSAGE " Error ", SQLCA.SQLCODE USING "<<<<"
    END CASE

    RETURN fetch_ok

END FUNCTION

FUNCTION mentor_fetch_rel_cust(p_fetch_flag)
    DEFINE
        p_fetch_flag SMALLINT,
        fetch_ok SMALLINT

    MESSAGE " "
    CALL mentor_fetch_custm(p_fetch_flag) RETURNING fetch_ok

    IF (fetch_ok) THEN
        CALL mentor_display_custm()
    ELSE
        IF (p_fetch_flag = 1) THEN
            MESSAGE "END OF THE LIST"
        ELSE
            MESSAGE "BEGINNING OF THE LIST"
        END IF
    END IF

END FUNCTION

FUNCTION mentor_display_custm()
    DISPLAY BY NAME mentor_rec.*
END FUNCTION

FUNCTION mentor_fun_input_clg1(au_flag)
    DEFINE
        au_flag CHAR(20),
        count_ok INTEGER

    LET count_ok = TRUE
    IF (au_flag = "A") THEN
        MESSAGE "ENTER MENTOR DETAILS"

        INITIALIZE mentor_rec.* TO NULL
    END IF

    LET int_flag = FALSE

    INPUT BY NAME mentor_rec.* WITHOUT DEFAULTS ATTRIBUTES(UNBUFFERED)

        ON CHANGE mentor_id
            IF au_flag = "A" THEN
                SELECT mentor_id, mentor_name, team_size
                    INTO mentor_rec.*
                    FROM mentor
                    WHERE mentor_id = mentor_rec.mentor_id
                IF (sqlca.sqlcode = 0) THEN
                    ERROR "MENTOR ID IS ALREADY IN DATABASE"
                    LET count_ok = FALSE
                    EXIT INPUT
                END IF
            END IF

        AFTER FIELD mentor_id
            IF mentor_rec.mentor_id IS NULL THEN
                ERROR "ENTER MENTOR ID"
                NEXT FIELD mentor_id
            END IF

            IF mentor_rec.mentor_id <= 0 THEN
                ERROR "MENTOR ID SHOULD BE GREATER THAN ZERO"
                NEXT FIELD mentor_id
            END IF

            IF mentor_rec.mentor_id MATCHES "[a-z A-Z]*" THEN
                MESSAGE "MENTOR ID SHOULD BE NUMBER "
                NEXT FIELD mentor_id
            END IF

        AFTER FIELD mentor_name
            IF mentor_rec.mentor_name IS NULL THEN
                ERROR "ENTER MENTOR NAME"
                NEXT FIELD mentor_name
            END IF

            IF NOT mentor_rec.mentor_name MATCHES "[a-z A-Z]*" THEN
                MESSAGE "NAME SHOULD BE CHARACTER"
                NEXT FIELD mentor_name
            END IF
            LET match = mentor_rec.mentor_name
            FOR i = 1 TO LENGTH(match)
                IF match.getCharAt(i) MATCHES "[0-9]" THEN
                    ERROR "NAME SHOULD BE CHARACTER ONLY"
                    NEXT FIELD mentor_name
                END IF
            END FOR

        AFTER FIELD team_size
            IF mentor_rec.team_size IS NULL THEN
                ERROR "ENTER TEAM SIZE"
                NEXT FIELD team_size
            END IF

            IF mentor_rec.team_size <= 0 THEN
                ERROR "TEAM SIZE SHOULD BE GREATER THAN ZERO"
                NEXT FIELD team_size
            END IF

            IF mentor_rec.team_size MATCHES "[a-z A-Z]*" THEN
                MESSAGE "TEAM SIZE SHOULD BE NUMBER "
                NEXT FIELD team_size
            END IF

            NEXT FIELD mentor_id

    END INPUT

    IF (int_flag) THEN
        LET int_flag = FALSE
        LET count_ok = FALSE
        MESSAGE "OPERATION CANCELLED BY USER"
    END IF

    RETURN count_ok

END FUNCTION

FUNCTION mentor_insert_cust()
    INPUT BY NAME mentor_rec.* WITHOUT DEFAULTS ATTRIBUTE(UNBUFFERED)

    WHENEVER ERROR CONTINUE
    INSERT INTO mentor VALUES(mentor_rec.*)
    WHENEVER ERROR STOP

    IF SQLCA.SQLCODE = 0 THEN
        MESSAGE "ROW ADDED"
    ELSE
        ERROR SQLERRMESSAGE
    END IF

END FUNCTION

FUNCTION mentor_update_cust()

    WHENEVER ERROR CONTINUE
    SELECT INTO mentor_rec FROM mentor WHERE mentor_id = mentor_rec.mentor_id
    INPUT BY NAME mentor_rec.* WITHOUT DEFAULTS ATTRIBUTE(UNBUFFERED)
    WHENEVER ERROR STOP

    WHENEVER ERROR CONTINUE
    UPDATE details
        SET mentor_name = mentor_rec.mentor_name,
            team_size = mentor_rec.team_size
        WHERE mentor_id = mentor_rec.mentor_id
    WHENEVER ERROR STOP

    IF SQLCA.SQLCODE = 0 THEN
        MESSAGE "ROW UPDATED"
    ELSE
        ERROR SQLERRMESSAGE
    END IF

END FUNCTION

FUNCTION mentor_delete_value()
    DEFINE del_ok SMALLINT

    WHENEVER ERROR CONTINUE
    DELETE FROM mentor WHERE mentor_id = mentor_rec.mentor_id
    WHENEVER ERROR STOP
    IF SQLCA.SQLCODE = 0 THEN
        MESSAGE "ROW DELETED"
        INITIALIZE mentor_rec.* TO NULL
        DISPLAY BY NAME mentor_rec.*
    ELSE
        ERROR SQLERRMESSAGE
    END IF

END FUNCTION

FUNCTION mentor_delete_check()
    DEFINE
        del_ok SMALLINT,
        del_count SMALLINT

    LET del_ok = FALSE

    WHENEVER ERROR CONTINUE
    SELECT COUNT(*)
        INTO del_count
        FROM mentor
        WHERE mentor.mentor_id = mentor_rec.mentor_id
    WHENEVER ERROR STOP

    IF del_count = 0 THEN
        MESSAGE "NO RECORD FOUND SO CANNOT BE DELETED"
        LET del_ok = FALSE
    ELSE
        MENU "DELETE" ATTRIBUTE(STYLE = "dialog", COMMENT = "DELETE THE ROW?")
            COMMAND "Yes"
                LET del_ok = TRUE
                EXIT MENU
            COMMAND "No"
                MESSAGE "OPERATION CANCLLED"
                EXIT MENU
        END MENU
    END IF

    RETURN del_ok

END FUNCTION

FUNCTION mentor_clean_up_fun()

    WHENEVER ERROR CONTINUE
    CLOSE cust_curs
    FREE cust_curs
    WHENEVER ERROR STOP

END FUNCTION

DATABASE project
DEFINE intern_rec RECORD LIKE intern.*
DEFINE query_ok SMALLINT
DEFINE match STRING
DEFINE i INT

FUNCTION intern_fun()

    OPEN WINDOW intern WITH FORM "internper"
    CALL ui.Interface.loadStyles("internstyle")
    CALL fun_intern()

    CLOSE WINDOW intern
END FUNCTION

FUNCTION fun_intern()
    DEFINE query_ok SMALLINT

    MENU
        COMMAND "find"
            CLEAR FORM
            CALL intern_query_cust() RETURNING query_ok
        COMMAND "next"
            IF (query_ok) THEN
                CALL intern_fetch_rel_cust(1)
            ELSE
                MESSAGE "YOU MUST QUERY FIRST."

            END IF
        COMMAND "previous"
            IF (query_ok) THEN
                CALL intern_fetch_rel_cust(-1)
            ELSE
                MESSAGE "YOU MUST QUERY FIRST."
            END IF

        ON ACTION ADD
            IF (intern_fun_input_clg1("A")) THEN
                CALL intern_insert_cust()
            END IF

        COMMAND "update"
            CALL intern_update_cust()

        COMMAND "Delete"
            IF (intern_delete_check()) THEN
                CALL intern_delete_value()
            END IF
        COMMAND "clear"
            CLEAR FORM
        COMMAND "quit"
            EXIT MENU
    END MENU

END FUNCTION

FUNCTION intern_query_cust()
    DEFINE
        cont_ok SMALLINT,
        cust_cnt SMALLINT,
        where_clause STRING

    MESSAGE "ENTER SEARCH CRITERIA"
    LET cont_ok = FALSE
    LET int_flag = FALSE

    CONSTRUCT BY NAME where_clause ON intern.*

    IF (int_flag) = TRUE THEN
        LET int_flag = FALSE
        CLEAR FORM
        LET cont_ok = FALSE
        MESSAGE "CANCELLED BY USER"
    ELSE
        CALL intern_get_cust_cntm(where_clause) RETURNING cust_cnt
        IF (cust_cnt > 0) THEN
            MESSAGE cust_cnt USING "<<<<", " ROWS FOUND"
            CALL intern_cust1_select(where_clause) RETURNING cont_ok
        ELSE
            MESSAGE "NO ROWS FOUND"
            LET cont_ok = FALSE
        END IF
    END IF

    IF (cont_ok) THEN
        CALL intern_display_custm()
    END IF

    RETURN cont_ok

END FUNCTION

FUNCTION intern_get_cust_cntm(p_where_clause)
    DEFINE
        p_where_clause STRING,
        sql_text STRING,
        cust_cnt SMALLINT

    LET sql_text =
        "SELECT COUNT(*) FROM intern  WHERE " || p_where_clause CLIPPED

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

FUNCTION intern_cust1_select(p_where_clause)
    DEFINE
        p_where_clause STRING,
        sql_text STRING,
        fetch_ok SMALLINT

    LET sql_text = "SELECT * FROM intern WHERE " || p_where_clause CLIPPED

    DECLARE cust_curs SCROLL CURSOR WITH HOLD FROM sql_text

    OPEN cust_curs
    CALL intern_fetch_custm(1) RETURNING fetch_ok
    IF NOT (fetch_ok) THEN
        MESSAGE "no rows in table."
    END IF

    RETURN fetch_ok

END FUNCTION

FUNCTION intern_fetch_custm(p_fetch_flag)
    DEFINE
        p_fetch_flag SMALLINT,
        fetch_ok SMALLINT

    LET fetch_ok = TRUE
    WHENEVER ERROR CONTINUE
    IF p_fetch_flag = 1 THEN
        FETCH NEXT cust_curs INTO intern_rec.*
    ELSE
        FETCH PREVIOUS cust_curs INTO intern_rec.*
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

FUNCTION intern_fetch_rel_cust(p_fetch_flag)
    DEFINE
        p_fetch_flag SMALLINT,
        fetch_ok SMALLINT

    MESSAGE " "
    CALL intern_fetch_custm(p_fetch_flag) RETURNING fetch_ok

    IF (fetch_ok) THEN
        CALL intern_display_custm()
    ELSE
        IF (p_fetch_flag = 1) THEN
            MESSAGE "END OF THE LIST"
        ELSE
            MESSAGE "BEGINNING OF THE LIST"
        END IF
    END IF

END FUNCTION

FUNCTION intern_display_custm()
    DISPLAY BY NAME intern_rec.*
END FUNCTION

FUNCTION intern_fun_input_clg1(au_flag)
    DEFINE
        au_flag CHAR(20),
        count_ok INTEGER

    LET count_ok = TRUE
    IF (au_flag = "A") THEN
        MESSAGE "ENTER INTERN DETAILS"

        INITIALIZE intern_rec.* TO NULL
    END IF

    LET int_flag = FALSE

    INPUT BY NAME intern_rec.* WITHOUT DEFAULTS ATTRIBUTES(UNBUFFERED)

        ON CHANGE id
            IF au_flag = "A" THEN
                SELECT id,
                    NAME,
                    qualification,
                    year_of_pass,
                    mobile_num,
                    email,
                    mentor_id
                    INTO intern_rec.*
                    FROM intern
                    WHERE id = intern_rec.id
                IF (sqlca.sqlcode = 0) THEN
                    ERROR "ID IS ALREADY IN DATABASE"
                    LET count_ok = FALSE
                    EXIT INPUT
                END IF
            END IF

        AFTER FIELD id
            IF intern_rec.id IS NULL THEN
                ERROR "ENTER INTERN ID"
                NEXT FIELD id
            END IF

            IF intern_rec.id <= 0 THEN
                ERROR "INTERN ID SHOULD BE GREATER THAN ZERO"
                NEXT FIELD id
            END IF

            --IF  intern_rec.mentor_id MATCHES "[a-z A-Z]*"  THEN
            --MESSAGE "MENTOR ID SHOULD BE NUMBER "
            --NEXT FIELD mentor_id
            --END IF

        AFTER FIELD name
            IF intern_rec.name IS NULL THEN
                ERROR "ENTER INTERN NAME"
                NEXT FIELD name
            END IF

            IF NOT intern_rec.name MATCHES "[a-z A-Z]*" THEN
                MESSAGE "INTERN NAME SHOULD BE CHARACTER"
                NEXT FIELD name
            END IF
            LET match = intern_rec.name
            FOR i = 1 TO LENGTH(match)
                IF match.getCharAt(i) MATCHES "[0-9]" THEN
                    ERROR "INTERN NAME SHOULD BE CHARACTER ONLY"
                    NEXT FIELD name
                END IF
            END FOR

        AFTER FIELD qualification
            IF intern_rec.qualification IS NULL THEN
                ERROR "ENTER QUALIFICATION"
                NEXT FIELD qualification
            END IF

        AFTER FIELD year_of_pass
            IF intern_rec.year_of_pass IS NULL THEN
                ERROR "ENTER YEAR OF PASSING"
                NEXT FIELD year_of_pass
            END IF

            IF intern_rec.year_of_pass <= 0 THEN
                ERROR "YEAR OF PASSING SHOULD BE GREATER THAN ZERO"
                NEXT FIELD year_of_pass
            END IF

        AFTER FIELD mobile_num
            IF intern_rec.mobile_num IS NULL THEN
                ERROR "ENTER MOBILE NUMBER"
                NEXT FIELD mobile_num
            END IF

            IF intern_rec.mobile_num <= 0 THEN
                ERROR "MOBILE NUMBER SHOULD BE GREATER THAN ZERO"
                NEXT FIELD mobile_num
            END IF

            LET match = intern_rec.mobile_num
            FOR i = 1 TO LENGTH(match)
                IF NOT match.GetcharAt(i) MATCHES "[0-9]" THEN
                    ERROR "MOBILE NUMBER CAN'T BE A CHARACTER"
                    NEXT FIELD mobile_num
                END IF
            END FOR

            IF LENGTH(match) > 10 THEN
                ERROR "MOBILE NUMBER MUST BE 10 DIGITS"
                NEXT FIELD mobile_num
            END IF

            IF LENGTH(match) < 10 THEN
                ERROR "MOBILE NUMBER MUST BE 10 DIGITS"
                NEXT FIELD mobile_num
            END IF

        AFTER FIELD email
            IF intern_rec.email IS NULL THEN
                ERROR "ENTER EMAIL ID"
                NEXT FIELD email
            END IF

        AFTER FIELD mentor_id
            IF intern_rec.mentor_id IS NULL THEN
                ERROR "ENTER MENTOR ID"
                NEXT FIELD mentor_id
            END IF

            IF intern_rec.mentor_id <= 0 THEN
                ERROR "MENTOR ID SHOULD BE GREATER THAN ZERO"
                NEXT FIELD mentor_id
            END IF

            NEXT FIELD id

    END INPUT

    IF (int_flag) THEN
        LET int_flag = FALSE
        LET count_ok = FALSE
        MESSAGE "OPERATION CANCELLED BY USER"
    END IF

    RETURN count_ok

END FUNCTION

FUNCTION intern_insert_cust()
    INPUT BY NAME intern_rec.* WITHOUT DEFAULTS ATTRIBUTE(UNBUFFERED)

    WHENEVER ERROR CONTINUE
    INSERT INTO intern VALUES(intern_rec.*)
    WHENEVER ERROR STOP

    IF SQLCA.SQLCODE = 0 THEN
        MESSAGE "ROW ADDED"
    ELSE
        ERROR SQLERRMESSAGE
    END IF

END FUNCTION

FUNCTION intern_update_cust()

    WHENEVER ERROR CONTINUE
    SELECT INTO intern_rec FROM intern WHERE id = intern_rec.id
    INPUT BY NAME intern_rec.* WITHOUT DEFAULTS ATTRIBUTE(UNBUFFERED)
    WHENEVER ERROR STOP

    WHENEVER ERROR CONTINUE
    UPDATE intern
        SET name = intern_rec.name,
            qualification = intern_rec.qualification,
            year_of_pass = intern_rec.year_of_pass,
            mobile_num = intern_rec.mobile_num,
            email = intern_rec.email,
            mentor_id = intern_rec.mentor_id
        WHERE id = intern_rec.id
    WHENEVER ERROR STOP

    IF SQLCA.SQLCODE = 0 THEN
        MESSAGE "ROW UPDATED"
    ELSE
        ERROR SQLERRMESSAGE
    END IF

END FUNCTION

FUNCTION intern_delete_value()
    DEFINE del_ok SMALLINT

    WHENEVER ERROR CONTINUE
    DELETE FROM intern WHERE id = intern_rec.id
    WHENEVER ERROR STOP
    IF SQLCA.SQLCODE = 0 THEN
        MESSAGE "ROW DELETED"
        INITIALIZE intern_rec.* TO NULL
        DISPLAY BY NAME intern_rec.*
    ELSE
        ERROR SQLERRMESSAGE
    END IF

END FUNCTION

FUNCTION intern_delete_check()
    DEFINE
        del_ok SMALLINT,
        del_count SMALLINT

    LET del_ok = FALSE

    WHENEVER ERROR CONTINUE
    SELECT COUNT(*) INTO del_count FROM intern WHERE intern.id = intern_rec.id
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

FUNCTION intern_clean_up_fun()

    WHENEVER ERROR CONTINUE
    CLOSE cust_curs
    FREE cust_curs
    WHENEVER ERROR STOP

END FUNCTION

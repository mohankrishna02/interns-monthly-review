DATABASE project
DEFINE details_rec RECORD LIKE details.*
DEFINE query_ok SMALLINT
DEFINE match STRING
DEFINE i INT

FUNCTION details_fun()

    OPEN WINDOW details WITH FORM "detailsper"
    CALL ui.Interface.loadStyles("detailsstyle")
    CALL fun_details()

    CLOSE WINDOW details
END FUNCTION

FUNCTION fun_details()
    DEFINE query_ok SMALLINT

    MENU
        COMMAND "find"
            CLEAR FORM
            CALL query_cust() RETURNING query_ok
        COMMAND "next"
            IF (query_ok) THEN
                CALL fetch_rel_cust(1)
            ELSE
                MESSAGE "YOU MUST QUERY FIRST."

            END IF
        COMMAND "previous"
            IF (query_ok) THEN
                CALL fetch_rel_cust(-1)
            ELSE
                MESSAGE "YOU MUST QUERY FIRST."
            END IF

        ON ACTION ADD
            IF (fun_input_clg1("A")) THEN
                CALL insert_cust()
            END IF

        COMMAND "update"
            CALL update_cust()

        COMMAND "Delete"
            IF (delete_check()) THEN
                CALL delete_value()
            END IF
        COMMAND "print"
            CALL details_report()
        COMMAND "clear"
            CLEAR FORM
        COMMAND "quit"
            EXIT MENU
    END MENU

END FUNCTION

FUNCTION query_cust()
    DEFINE
        cont_ok SMALLINT,
        cust_cnt SMALLINT,
        where_clause STRING

    MESSAGE "ENTER SEARCH CRITERIA"
    LET cont_ok = FALSE
    LET int_flag = FALSE

    CONSTRUCT BY NAME where_clause ON details.intern_id

    IF (int_flag) = TRUE THEN
        LET int_flag = FALSE
        CLEAR FORM
        LET cont_ok = FALSE
        MESSAGE "CANCELED BY USER"
    ELSE
        CALL get_cust_cntm(where_clause) RETURNING cust_cnt
        IF (cust_cnt > 0) THEN
            MESSAGE cust_cnt USING "<<<<", "ROWS FOUND"
            CALL cust1_select(where_clause) RETURNING cont_ok
        ELSE
            MESSAGE "NO ROWS FOUND"
            LET cont_ok = FALSE
        END IF
    END IF

    IF (cont_ok) THEN
        CALL display_custm()
    END IF

    RETURN cont_ok

END FUNCTION

FUNCTION get_cust_cntm(p_where_clause)
    DEFINE
        p_where_clause STRING,
        sql_text STRING,
        cust_cnt SMALLINT

    LET sql_text =
        "SELECT COUNT(*) FROM details  WHERE " || p_where_clause CLIPPED

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

FUNCTION cust1_select(p_where_clause)
    DEFINE
        p_where_clause STRING,
        sql_text STRING,
        fetch_ok SMALLINT

    LET sql_text = "SELECT * FROM details WHERE " || p_where_clause CLIPPED

    DECLARE cust_curs SCROLL CURSOR WITH HOLD FROM sql_text

    OPEN cust_curs
    CALL fetch_custm(1) RETURNING fetch_ok
    IF NOT (fetch_ok) THEN
        MESSAGE "NO ROWS IN THE TABLE"
    END IF

    RETURN fetch_ok

END FUNCTION

FUNCTION fetch_custm(p_fetch_flag)
    DEFINE
        p_fetch_flag SMALLINT,
        fetch_ok SMALLINT

    LET fetch_ok = TRUE
    WHENEVER ERROR CONTINUE
    IF p_fetch_flag = 1 THEN
        FETCH NEXT cust_curs INTO details_rec.*
    ELSE
        FETCH PREVIOUS cust_curs INTO details_rec.*
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

FUNCTION fetch_rel_cust(p_fetch_flag)
    DEFINE
        p_fetch_flag SMALLINT,
        fetch_ok SMALLINT

    MESSAGE " "
    CALL fetch_custm(p_fetch_flag) RETURNING fetch_ok

    IF (fetch_ok) THEN
        CALL display_custm()
    ELSE
        IF (p_fetch_flag = 1) THEN
            MESSAGE "END OF THE LIST"
        ELSE
            MESSAGE "BEGINNING OF THE LIST"
        END IF
    END IF

END FUNCTION

FUNCTION display_custm()
    DISPLAY BY NAME details_rec.*
END FUNCTION

FUNCTION fun_input_clg1(au_flag)
    DEFINE
        au_flag CHAR(20),
        count_ok INTEGER

    LET count_ok = TRUE
    IF (au_flag = "A") THEN
        MESSAGE "ENTER DETAILS"

        INITIALIZE details_rec.* TO NULL
    END IF

    LET int_flag = FALSE

    INPUT BY NAME details_rec.* WITHOUT DEFAULTS ATTRIBUTES(UNBUFFERED)

        AFTER FIELD intern_id
            IF details_rec.intern_id IS NULL THEN
                ERROR "ENTER INTERN ID"
                NEXT FIELD intern_id
            END IF

            IF details_rec.intern_id <= 0 THEN
                ERROR "INTERN ID SHOULD BE GREATER THAN ZERO"
                NEXT FIELD intern_id
            END IF

        AFTER FIELD name
            IF details_rec.name IS NULL THEN
                ERROR "ENTER INTERN NAME"
                NEXT FIELD name
            END IF

            IF NOT details_rec.name MATCHES "[a-z A-Z]*" THEN
                MESSAGE "INTERN NAME SHOULD BE CHARACTER"
                NEXT FIELD name
            END IF
            LET match = details_rec.name
            FOR i = 1 TO LENGTH(match)
                IF match.getCharAt(i) MATCHES "[0-9]" THEN
                    ERROR "INTERN NAME SHOULD BE CHARACTER ONLY"
                    NEXT FIELD name
                END IF
            END FOR

        AFTER FIELD mentor_name
            IF details_rec.mentor_name IS NULL THEN
                ERROR "ENTER MENTOR NAME"
                NEXT FIELD mentor_name
            END IF

            IF NOT details_rec.mentor_name MATCHES "[a-z A-Z]*" THEN
                MESSAGE "MENTOR NAME SHOULD BE CHARACTER"
                NEXT FIELD mentor_name
            END IF
            LET match = details_rec.mentor_name
            FOR i = 1 TO LENGTH(match)
                IF match.getCharAt(i) MATCHES "[0-9]" THEN
                    ERROR "MENTOR NAME SHOULD BE CHARACTER ONLY"
                    NEXT FIELD mentor_name
                END IF
            END FOR

        AFTER FIELD test1
            IF details_rec.test1 IS NULL THEN
                ERROR "ENTER TEST1 RESULT"
                NEXT FIELD test1
            END IF

        AFTER FIELD test2
            IF details_rec.test2 IS NULL THEN
                ERROR "ENTER TEST2 RESULT"
                NEXT FIELD test2
            END IF

        AFTER FIELD test3
            IF details_rec.test3 IS NULL THEN
                ERROR "ENTER TEST3 RESULT"
                NEXT FIELD test3
            END IF

        AFTER FIELD monthly_test_result
            IF details_rec.monthly_test_result IS NULL THEN
                ERROR "ENTER MONTHLY TEST RESULT"
                NEXT FIELD monthly_test_result
            END IF

        AFTER FIELD attendance
            IF details_rec.attendance IS NULL THEN
                ERROR "ENTER ATTENDANCE"
                NEXT FIELD attendance
            END IF

            NEXT FIELD intern_id

    END INPUT

    IF (int_flag) THEN
        LET int_flag = FALSE
        LET count_ok = FALSE
        MESSAGE "OPERATION CANCELLED BY USER"
    END IF

    RETURN count_ok

END FUNCTION

FUNCTION insert_cust()
    INPUT BY NAME details_rec.* WITHOUT DEFAULTS ATTRIBUTE(UNBUFFERED)

    WHENEVER ERROR CONTINUE
    INSERT INTO details VALUES(details_rec.*)
    WHENEVER ERROR STOP

    IF SQLCA.SQLCODE = 0 THEN
        MESSAGE "ROW ADDED"
    ELSE
        ERROR SQLERRMESSAGE
    END IF

END FUNCTION

FUNCTION update_cust()

    WHENEVER ERROR CONTINUE
    SELECT INTO details_rec FROM details WHERE intern_id = details_rec.intern_id
    INPUT BY NAME details_rec.* WITHOUT DEFAULTS ATTRIBUTE(UNBUFFERED)
    WHENEVER ERROR STOP

    WHENEVER ERROR CONTINUE
    UPDATE details
      SET   intern_id = details_rec.intern_id,
           name = details_rec.name,
            mentor_name = details_rec.mentor_name,
            test1 = details_rec.test1,
            test2 = details_rec.test2,
            test3 = details_rec.test3,
            monthly_test_result = details_rec.monthly_test_result
           
        WHERE  attendance = details_rec.attendance AND details.intern_id = details_rec.intern_id
    WHENEVER ERROR STOP

    IF SQLCA.SQLCODE = 0 THEN
        MESSAGE "ROW UPDATED"
    ELSE
        ERROR SQLERRMESSAGE
    END IF

END FUNCTION

FUNCTION delete_value()
    DEFINE del_ok SMALLINT

    WHENEVER ERROR CONTINUE
    DELETE FROM details WHERE attendance = details_rec.attendance AND details.intern_id = details_rec.intern_id
    WHENEVER ERROR STOP
    IF SQLCA.SQLCODE = 0 THEN
        MESSAGE "ROW DELETED"
        INITIALIZE details_rec.* TO NULL
        DISPLAY BY NAME details_rec.*
    ELSE
        ERROR SQLERRMESSAGE
    END IF

END FUNCTION

FUNCTION delete_check()
    DEFINE
        del_ok SMALLINT,
        del_count SMALLINT

    LET del_ok = FALSE

    WHENEVER ERROR CONTINUE
    SELECT COUNT(*)
        INTO del_count
        FROM details
        WHERE details.intern_id = details_rec.intern_id
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

FUNCTION clean_up_fun()

    WHENEVER ERROR CONTINUE
    CLOSE cust_curs
    FREE cust_curs
    WHENEVER ERROR STOP

END FUNCTION

FUNCTION details_report()
    DEFINE detailsrec RECORD
        intern_id LIKE details.intern_id,
        name LIKE details.name,
        mentor_name LIKE details.mentor_name,
        test1 LIKE details.test1,
        test2 LIKE details.test2,
        test3 LIKE details.test3,
        monthly_test_result LIKE details.monthly_test_result,
        attendance LIKE details.attendance

    END RECORD
--EXIT PROGRAM

    START REPORT detailsreport TO "detailsreport.txt"

    DECLARE cust_curs2 CURSOR FOR
        SELECT intern_id,
            NAME,
            mentor_name,
            test1,
            test2,
            test3,
            monthly_test_result,
            attendance
            FROM details
            WHERE details.intern_id = details_rec.intern_id
            ORDER BY intern_id
        
        

    FOREACH cust_curs2 INTO detailsrec.*
        OUTPUT TO REPORT detailsreport(detailsrec.*)
    END FOREACH
    FINISH REPORT detailsreport

END FUNCTION

REPORT detailsreport(printdetailsrec)

    DEFINE printdetailsrec RECORD
        intern_id LIKE details.intern_id,
        name LIKE details.name,
        mentor_name LIKE details.mentor_name,
        test1 LIKE details.test1,
        test2 LIKE details.test2,
        test3 LIKE details.test3,
        monthly_test_result LIKE details.monthly_test_result,
        attendance LIKE details.attendance

    END RECORD

    OUTPUT
        TOP MARGIN 0
        LEFT MARGIN 0
        RIGHT MARGIN 0
        BOTTOM MARGIN 0

    FORMAT
        PAGE HEADER

            PRINT COLUMN 01,
                "--------------------------------------------------------------------------------------------------------------------"
            SKIP 1 LINES

            PRINT COLUMN 50, "DETAILS REPORT";
            SKIP 2 LINES
            PRINT COLUMN 01,
                "---------------------------------------------------------------------------------------------------------------------"
            SKIP 1 LINES

            PRINT COLUMN 5, "INTERN ID";
            PRINT COLUMN 20, "NAME";
            PRINT COLUMN 32, "MENTOR NAME";
            PRINT COLUMN 50, "TEST1";
            PRINT COLUMN 60, "TEST2";
            PRINT COLUMN 70, "TEST3";
            PRINT COLUMN 80, "MONTHLY TEST RESULT";
            PRINT COLUMN 105, "ATTENDANCE"
            SKIP 2 LINES
            PRINT COLUMN 01,
                "--------------------------------------------------------------------------------------------------------------------"
        ON EVERY ROW
            SKIP 2 LINES
            PRINT COLUMN 00,
                printdetailsrec.intern_id,
                COLUMN 20,
                printdetailsrec.name,
                COLUMN 35,
                printdetailsrec.mentor_name,
                COLUMN 42,
                printdetailsrec.test1,
                COLUMN 52,
                printdetailsrec.test2,
                COLUMN 58,
                printdetailsrec.test3,
                COLUMN 80,
                printdetailsrec.monthly_test_result,
                COLUMN 100,
                printdetailsrec.attendance

END REPORT

DATABASE project

TYPE mohan_rec RECORD
    mentor_id LIKE mentor.mentor_id,
    mentor_name LIKE mentor.mentor_name,

    id LIKE intern.id,
    name LIKE intern.name

END RECORD

DEFINE details_rec mohan_rec

FUNCTION trans_fun()

    DEFINE query_ok SMALLINT
    OPEN WINDOW transaction WITH FORM "transper"
    MENU
        ON ACTION find
            CALL tran_query_cust()
            CALL display_tran_custarr()
            ON ACTION CANCEL
            CLEAR FORM 

        ON ACTION QUIT
            EXIT MENU
    END MENU

    CLOSE WINDOW transaction
END FUNCTION


FUNCTION tran_query_cust()
    DEFINE
        cont_ok SMALLINT,
        cust_cnt SMALLINT,
        where_clause STRING

    MESSAGE "Enter search criteria"
    LET cont_ok = FALSE
    LET int_flag = FALSE

    CONSTRUCT BY NAME where_clause
        ON intern.id, intern.name, mentor.mentor_id, mentor.mentor_name

    IF (int_flag) = TRUE THEN
        LET int_flag = FALSE
        CLEAR FORM
        LET cont_ok = FALSE
        MESSAGE "Canceled by user."
    ELSE
        CALL tran_get_cust_cnt(where_clause) RETURNING cust_cnt
        IF (cust_cnt > 0) THEN
            MESSAGE cust_cnt USING "<<<<", " rows found."
            CALL tran_cust_select(where_clause) RETURNING cont_ok
        ELSE
            MESSAGE "No rows found."
            LET cont_ok = FALSE
        END IF
    END IF

    IF (cont_ok) THEN
        CALL display_tran_cust()
    END IF

END FUNCTION

FUNCTION tran_get_cust_cnt(p_where_clause)
    DEFINE
        p_where_clause STRING,
        sql_text STRING,
        cust_cnt SMALLINT

    LET sql_text =
        "SELECT COUNT(*) FROM intern ,mentor WHERE intern.mentor_id = mentor.mentor_id  AND "
            || p_where_clause CLIPPED

    PREPARE cust_cnt_stmt FROM sql_text
    EXECUTE cust_cnt_stmt INTO cust_cnt
    FREE cust_cnt_stmt

    RETURN cust_cnt

END FUNCTION

FUNCTION tran_cust_select(p_where_clause)
    DEFINE
        p_where_clause STRING,
        sql_text STRING,
        fetch_ok SMALLINT

    LET sql_text =
        "   SELECT mentor.mentor_id, mentor.mentor_name , intern.id, intern.name "
            || " FROM intern ,mentor WHERE intern.mentor_id = mentor.mentor_id  AND "
            || p_where_clause CLIPPED
    PREPARE query_stmt FROM sql_text
    DECLARE cust_curs SCROLL CURSOR FOR query_stmt
    OPEN cust_curs
    CALL fetch_tra_cust(1) RETURNING fetch_ok
    IF NOT (fetch_ok) THEN
        MESSAGE "no rows in table."
    END IF

    RETURN fetch_ok

END FUNCTION

FUNCTION fetch_tra_cust(p_fetch_flag)
    DEFINE
        p_fetch_flag SMALLINT,
        fetch_ok SMALLINT

    LET fetch_ok = TRUE
    IF (p_fetch_flag = 1) THEN
        FETCH NEXT cust_curs INTO details_rec.*
    ELSE
        FETCH PREVIOUS cust_curs INTO details_rec.*
    END IF

    IF (SQLCA.SQLCODE = NOTFOUND) THEN
        LET fetch_ok = FALSE
    END IF

    RETURN fetch_ok

END FUNCTION

FUNCTION fetch_tra_rel_cust(p_fetch_flag)
    DEFINE
        p_fetch_flag SMALLINT,
        fetch_ok SMALLINT

    MESSAGE " "
    CALL fetch_tra_cust(p_fetch_flag) RETURNING fetch_ok

    IF (fetch_ok) THEN
        CALL display_tran_cust()
    ELSE
        IF (p_fetch_flag = 1) THEN
            MESSAGE "End of list"
        ELSE
            MESSAGE "Beginning of list"
        END IF
    END IF

END FUNCTION

FUNCTION display_tran_cust()
    DISPLAY BY NAME details_rec.*
END FUNCTION

FUNCTION display_tran_custarr()

    DEFINE dep_arr DYNAMIC ARRAY OF RECORD LIKE details.*

    DEFINE idx SMALLINT

    DECLARE orderlist CURSOR FOR
        SELECT * FROM details WHERE details_rec.id = details.intern_id
    LET idx = 1

    WHENEVER ERROR CONTINUE
    FOREACH orderlist INTO dep_arr[idx].*
        LET idx = idx + 1
    END FOREACH
    WHENEVER ERROR STOP

    DISPLAY ARRAY dep_arr TO mohan.*

END FUNCTION

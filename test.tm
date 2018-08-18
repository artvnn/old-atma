/* ------------------------------------------- */
/* --- Comments                            --- */
/* ------------------------------------------- */
(a /* Inside a list */ b)

/* ------------------------------------------- */
/* --- String                              --- */
/* ------------------------------------------- */
'String with escaped \'!'
(a 'string' 'string with \'' b)

/* ------------------------------------------- */
/* --- Multi-line string                   --- */
/* ------------------------------------------- */
<% 	Line (1)
Line #2
'Quoted'
%>
(a
  <% 	Line (1)
		Line #2
		'Quoted'
  %>
  b)

/* ------------------------------------------- */
/* --- Embed                               --- */
/* ------------------------------------------- */
<<embedFile:test>>
(a <<embedFile:test>> (b <<embedFile:test>> (c)))

/* ------------------------------------------- */
/* --- List                                --- */
/* ------------------------------------------- */
()
(a)
( a)
( a )
( a = b * / - > < & % $ # @ ! ~ ` . ? / \ | [ ] )
(a b c d)
(a b (c d) e f)
(a b (c d (e f) g) h)
(= true false)
(* 123 456)
(! true)
((a))
('Some comment' a b)
( 'Some other comment' a b c )

/* ------------------------------------------- */
/* --- Sample                              --- */
/* ------------------------------------------- */
(interface authenticator
  (public
    (fn isValid)))
(class testAuthenticator
  (private
    (string validLoginName)
    (password validPassword))
  (public
    (fn isValid
      (input (string loginName) password)
      (return
        (and
          (= validLoginName loginName)
          (= validPassword password)))))
  (constructor
    (input (string loginName) password)
    (logic
      (let validLoginName loginName)
      (let validPassword password))))
(class user persistant
  (public
    id
    (string loginName)
    password
    (string userName)
    email))
(enum sessionState
  (active 0)
  timedOut
  closed)
(class session persistant
  (public
    id
    (date startedAt (now))
    (sessionState state active)
    (date closedAt)
    (date lastActivityAt)
    (guid token (newGuid))
    user))
(class clientSession
  (public
    (string token)
    (string userName))
  (constructor
    (input session)
    (logic
      (let token session.token)
      (let userName session.user.userName))))
(service login
  (errorMessage 'Sorry, was unable to login, please try again after sometime.')
  (tests
    (test 'given valid credentials should login successfully'
      (inject (authenticator (testAuthenticator 'manoj' '1234')))
      (noError ((login (loginName 'manoj') (password '1234')))))
    (test 'given invalid credentials should return error'
      (inject (authenticator (testAuthenticator 'manoj' '1234')))
      (shouldError 'Invalid login credentials' ((login (loginName 'kumar') (password '5678')))))
    (do
      (input
        (string loginName)
        password)
      (logic
        (if (! (authenticator.isValid ))
          (error 'Invalid login credentials'))
        (return
          (data session (clientSession
                          (session
                            (user
                              (store.get
                                (data (loginName loginName) (password password))))))))))))
(service logout
  (errorMessage 'Sorry, was unable to logout, please try again after sometime.')
  (tests
    (test 'given valid session should logout'
      (inject (authenticator (testAuthenticator 'manoj' '1234')))
      (let session (login (loginName 'manoj') (password '1234')))
      (noError (logout (logout (token session.token)))))
    (test 'given invalid session should return error'
      (inject (authenticator (testAuthenticator 'manoj' '1234')))
      (shouldError 'Invalid session' (logout (token '3456')))))
  (do
    (input (guid token))
    (logic
      (let session (store.get (data (token token))))
      (guard (!= null session) 'Invalid session')
      (set session
        (state sessionState.closed)
        (closedAt (now)))
      (store.update session))))

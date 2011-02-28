$(document).ready(function(){ 
  rollcall = new Sail.Rollcall.Client('http://rollcall.proto.encorelab.org')
  token = rollcall.getCurrentToken()
  rollcall.fetchSessionForToken(token, function(data) {
      console.log("Authenticated as: ", data.session.user.username, data.session.user.encrypted_password)

	  Sail.Strophe.bosh_url = '/http-bind/'
	  Sail.Strophe.jid = data.session.user.username+'@proto.encorelab.org'
	  Sail.Strophe.password = data.session.user.encrypted_password
	  Sail.Strophe.connect()
	
  })
})

function parseMsg(msg) {
  try {
		data = JSON.parse($(msg).find('body').text())
		return data
	} catch (e) {
		console.log("IGNORING BAD JSON: ", e)
		return
	}
}
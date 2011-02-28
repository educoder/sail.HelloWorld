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
    
  var groupchat
  
  Sail.Strophe.onConnectSuccess = function() {
    groupchat = Sail.Strophe.joinGroupchat('s3@conference.proto.encorelab.org')
    
    groupchat.addHandler(function(msg) {
      $('#chatlog').append($(msg).find('body').text()+"<br />")
    })
    
    $('#send').click(function() {
      text = $('#chatinput')
      groupchat.sendText(text.val())
      text.val("")
    })
  }

})
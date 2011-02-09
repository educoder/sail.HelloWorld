require 'rack/reverse_proxy'

use Rack::ReverseProxy do
  reverse_proxy '/http-bind/', 'http://proto.encorelab.org:7070/http-bind/'
end

run Rack::Directory.new('.')

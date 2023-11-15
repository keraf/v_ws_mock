module main

import net.websocket
import term
import time


fn slog(message string) {
	eprintln(term.colorize(term.bright_yellow, message))
}

// this server accepts client connections and broadcast all messages to other connected clients
fn main() {
	eprintln('press ctrl-c to quit...')
	start_server()!
}

fn start_server() ! {
	slog('start_server')
	mut s := websocket.new_server(.ip6, 3600, '')
	defer {
		unsafe {
			s.free()
		}
	}

	s.set_ping_interval(100)
	s.on_connect(fn (mut s websocket.ServerClient) !bool {
		slog('s.on_connect')
		if s.resource_name != '/' {
			return false
		}
		return true
	})!

	s.on_message_ref(fn (mut ws websocket.Client, msg &websocket.Message, mut m websocket.Server) ! {
		slog('s.on_message_ref: ${msg}')

		response := ["Airpl", "anes ", "are r", "emark", "able ", "for t", "heir ", "abil", "ity t", "o shr", "ink d", "istanc", "es, c", "onnec", "ting ", "the w", "orld ", "and e", "nabli", "ng us", " to ex", "plore ", "diver", "se cu", "lture", "s whi", "le ma", "rvelin", "g at ", "the b", "reatht", "akin", "g view", "s fro", "m abo", "ve."]
		for _, chunk in response {
			ws.write_string(chunk)!
			time.sleep(1000 * 1000 * 100)
		}

		ws.close(0, "completed")!
	}, s)

	s.on_close(fn (mut ws websocket.Client, code int, reason string) ! {
		slog('s.on_close')
		println(term.green('client (${ws.id}) closed connection'))
	})

	s.listen() or { println(term.red('error on server listen: ${err}')) }
	slog('s.listen done')
}

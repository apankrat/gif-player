/*
 *	Copyright (c) 2012 Alex Pankratov. All rights reserved.
 *
 *	http://swapped.cc/gif-player
 */
 
/*
 *	This code is distributed under terms of BSD license. 
 *	You can obtain the copy of the license by visiting:
 *
 *	http://www.opensource.org/licenses/bsd-license.php
 */

function gifPlayer(cont, opts) {

	/* 
	 *	parameters
	 */
	var defaults = {
		autoplay: true,
		play:     function(s, m, cb) { s.hide(); m.show(); cb(); },
		stop:     function(m, s, cb) { m.hide(); s.show(); cb(); }
	};

	var opts = $.extend({}, defaults, opts);
	
	/*
	 *	variables
	 */
	var c = cont;
	var s = cont.find('.gif-still');
	var m = cont.find('.gif-movie');

	var state = 'e';
	var busy = false;

	var i = new Image;

	/* 
	 *	functions
	 */
	var setState = function(was, now) {
		c.removeClass('gif-player-' + was);
		c.addClass('gif-player-' + now);
		state = now;
	}

	var play = opts['play'];
	var stop = opts['stop'];
	var done = function() { busy = false; }

	/* 
	 *	click() handler
	 */
	this.act = function()
	{
		if (busy)
			return;

		switch (state)
		{

		case 'e': /* empty, ready to load */

			setState('e', 'l');
			m.load(function(){ 

				i.src = m.attr('src');
				m.unbind('load');

				if (! opts['autoplay'])
				{
					setState('l','s');
					return;
				}

				setState('l','p');
				busy = true;
				play(s, m, done);
			});
			m.attr('src', m.attr('gif'));
			break;

		case 'l': /* loading... */

			setState('l', 'e');
			m.unbind('load');
			m.attr('src', '');
			break;

		case 's': /* stopped, ready to play */

			/* this rewinds the gif, not in all browsers */
			m.attr('src', null).attr('src', i.src);

			setState('s', 'p');
			busy = true;
			play(s, m, done);
			break;
		
		case 'p': /* playing... */

			setState('p', 's');
			busy = true;
			stop(m, s, done);
			break;
		}
	}
	
	/*
	 *	initialization
	 */
	var that = this;

	c.find('.gif-ctrl').click( function(){ that.act(); });
	c.addClass('gif-player-e');
	m.hide(); s.show();
}

/*
 *	Sample usage:
 *
 *
 *	$(document).ready( function(){
 *
 *		$('.gif-player').each(function(){
 *		
 *			var self = $(this);
 *			this.gp = new gifPlayer(self, { autoplay: false });
 *
 *		});
 *	});
 *
 */


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

	/* parameters */
	var defaults = {
		autoplay: true,
		play:     function(s, m) { s.hide(); m.show() },
		stop:     function(m, s) { m.hide(); s.show() }
	};

	var opts = $.extend({}, defaults, opts);
	
	/* variables */
	var c = cont;
	var s = cont.find('.gif-still');
	var m = cont.find('.gif-movie');
	var i = new Image;
	var state = 'e';

	/* functions */
	var setState = function(was, now) {
		c.removeClass('gif-player-' + was);
		c.addClass('gif-player-' + now);
		state = now;
	}

	this.act = function()
	{
		switch (state)
		{

		case 'e': /* empty, ready to load */

			setState('e', 'l');
			m.load(function(){ 

				i.src = m.attr('src');
				m.unbind('load');

				if (opts['autoplay'])
				{
					setState('l','p');
					opts['play'](s, m);
				}
				else
					setState('l','s');
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
			opts['play'](s, m);
			break;
		
		case 'p': /* playing... */

			setState('p', 's');
			opts['stop'](m, s);
			break;
		}
	}
	
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


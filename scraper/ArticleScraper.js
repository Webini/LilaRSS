"use strict";

var url          = require('url');
var sanitizeHtml = require('sanitize-html');

const PARAGRAPH_MIN = 4;
//>p,>blockquote,>h2,>h3,>h4,>h5,>h6,>div img,>div iframe,>iframe,>video,>div video
const FIND_PARAMETERS = '>blockquote' +
                        '>h1,' +
                        '>h2,' +
                        '>h3,' +
                        '>h4,' +
                        '>h5,' +
                        '>h6,' +
                        '>ol,' +
                        '>ul,' +
                        '>p,' +
                        '>img,' +
                        '>div img,' +
                        '>table,' +
                        '>caption,' +
                        '>iframe,' +
                        '>div iframe';

const PURIFY_OPTIONS = {
    allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 
                   'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'br', 'div',
                   'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 
                   'span', 'iframe' ],
    allowedAttributes: {
        a: [ 'href', 'name', 'target' ],
        iframe: [ 'src', 'width', 'height' ],
        img: [ 'src', 'width', 'height', 'alt', 'title', 'srcset', 'size' ]
    },
    // Lots of these won't come up by default because we don't allow them
    selfClosing: [ 'img', 'br', 'hr' ],
    // URL schemes we permit
    allowedSchemes: [ 'http', 'https', 'mailto' ]
};

const ALLOWED_IFRAME_HOSTS = /^(http:\/\/|https:\/\/|\/\/)(www\.)?(youtube.com|dailymotion\.com|player.vimeo.com)([a-z0-9-_\.\/\?\[\]%&=]*)$/i;

class ArticleScraper {
    constructor(originUrl, $el, $){
        this.originUrl  = originUrl;
        this.$container = null;
        this.$content   = null;
        this.$          = $;
        this._retreiveContainer($el);
    }
    
    /**
     * Retreive article container of $el
     * @return {undefined}
     */
    _retreiveContainer($el){
        var $p   = $el.find('p');
        var done = [];
        
        for (let i = 0, sz = $p.length; i < sz; i++) {
            let $parent = $p.eq(i).parent();
            
            if (done.indexOf($parent[0]) !== -1) {
                continue;
            }
            
            let psz = $parent.find('>p').length;
            if (psz >= PARAGRAPH_MIN) {
                this.$container = $parent;
                break;
            }
            
            done.push($parent[0]);
        }
    }
    
    /**
     * Retreive content
     * @return {CheerioElements}
     */
    _defineContent() {
        this.$content = this.$('<div id="content"></div>')
                            .append(this.$container.find(FIND_PARAMETERS));
    }
    
    _normalizeSrc() {
        var originUrl = this.originUrl;
        var $ = this.$;
        
        //normalize src
        this.$content.find('[src]').each(function(){
            var $el = $(this);
            var src = $el.attr('src');
            
            if (src) {
                $el.attr('src', url.resolve(originUrl, src));
            }
        });
    }
    
    _normalizeHref() {
        var originUrl = this.originUrl;
        var $ = this.$;
        
        //normalize href & put target blank
        this.$content.find('[href]').each(function(){
            var $el = $(this);
            var src = $el.attr('href');
            
            if (src) {
                $el.attr('href', url.resolve(originUrl, src));
            }
            
            if ($el.is('a')) {
                $el.attr('target', '_BLANK');
            }
        });
    }
    
    _normalizeIframes() {
        var $ = this.$;
        
        //remove invalid iframes
        this.$content.find('iframe').each(function(){
            var $el = $(this);
            var src = $el.attr('src');
            
            if (src.match(ALLOWED_IFRAME_HOSTS) === null) {
                let $parent = $el.parentsUntil('#content');
                if ($parent.length <= 0) {
                    $parent = $el;
                }
                $parent.remove();
            }
        });
    }
    
    getHtml() {
        if (!this.$container) {
            return;
        }
        
        this._defineContent(); 
        this._normalizeIframes();
        this._normalizeSrc();
        this._normalizeHref();
        
        return sanitizeHtml(this.$content.html(), PURIFY_OPTIONS);   
    }
}


module.exports = function($el, $, originUrl){
    var scraper = new ArticleScraper(originUrl, $el, $);
    return scraper.getHtml();
};

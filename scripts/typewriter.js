!(function (t) {
    const e = (t) => new Promise((e) => setTimeout(e, t))
    t.fn.typeWrite = function (opts, str) {
      var r = t.extend(
        { speed: 60, repeat: !1, cursor: !0, color: 'white', interval: 1e3 }, opts
      )
      let i = 100 - 60
      return new Promise((s, a) => {
        this.each(async function () {
          a = str
          console.log(str)
          ;(letters = a.split('')),
            t(this).text(''),
            t(this).css('color', r.color),
            t(this).css('margin', '0px')
            t(this).css('display', 'block')
          var n = letters[0]
          for (let s = 0; s < letters.length; s++)
            1 == r.cursor
              ? void 0 !== letters[s + 1]
                ? (t(this).text(n),
                  t('#cursor').remove(),
                  t(this).append("<span id='cursor'>|</span>"),
                  t('#cursor').css('animation', 'blink 1s infinite'),
                  (n += letters[s + 1]),
                  await e(letters[s] == ' ' && (letters[s-1] == ',' || letters[s-1] == '?') ? i + 400 : i))
                : (t(this).text(n),
                  t('#cursor').remove(),
                  t(this).append("<span id='cursor'>|</span>"),
                  (n += letters[s]),
                  await e((letters[s] == ',' || letters[s] == '?') ? i + 100 : i))
              : void 0 !== letters[s + 1]
              ? (t(this).text(n), (n += letters[s + 1]), await e(i))
              : (t(this).text(n), (n += letters[s]), await e(i))
          s('Done')
          $('#cursor').remove()
        })
      })
    }
  })(jQuery)
  
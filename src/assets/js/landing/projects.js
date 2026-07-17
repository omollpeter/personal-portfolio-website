export function initProjects() {
  $(function () {
    requestAnimationFrame(function () {
      const $book = $('#prjBook');
      const W = $book.width();
      const H = $book.height();

      let TOTAL = 0;

      function syncUI(page) {
        const $dots = $('#prjProgress .prj-pdot');
        $dots.removeClass('active').eq(page - 1).addClass('active');
        $('#btnPrev').prop('disabled', page <= 1);
        $('#btnNext').prop('disabled', page >= TOTAL);
      }

      $('#flipbook').turn({
        width: W,
        height: H,
        display: 'single',
        acceleration: true,
        gradients: true,
        duration: 700,
        page: 1,
        when: {
          turning: function (e, page) { syncUI(page); },
          turned: function (e, page) { syncUI(page); }
        }
      });

      TOTAL = $('#flipbook').turn('pages');

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          document.getElementById('prjBook').classList.add('is-ready');
        });
      });

      for (let i = 0; i < TOTAL; i++) {
        const dot = $('<div class="prj-pdot"></div>');
        if (i === 0) dot.addClass('active');
        $('#prjProgress').append(dot);
      }

      $('#btnNext').on('click', function () { $('#flipbook').turn('next'); });
      $('#btnPrev').on('click', function () { $('#flipbook').turn('previous'); });

      $(document).on('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') $('#flipbook').turn('next');
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') $('#flipbook').turn('previous');
      });

      syncUI(1);
    });
  });
}
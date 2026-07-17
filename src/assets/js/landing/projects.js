export function initProjects() {
  $(function () {
    requestAnimationFrame(function () {
      const $book = $('#prjBook');
      const $fb = $('#flipbook');

      const originalHTML = $fb.html();

      let TOTAL = 0;
      let dotsBuilt = false;

      function syncUI(page) {
        const $dots = $('#prjProgress .prj-pdot');
        $dots.removeClass('active').eq(page - 1).addClass('active');
        $('#btnPrev').prop('disabled', page <= 1);
        $('#btnNext').prop('disabled', page >= TOTAL);
      }

      function destroyFlipbook() {
        try {
          if ($fb.data('turn')) {
            $fb.turn('destroy');
          }
        } catch (e) {}
        $fb.removeData();
        $fb.html(originalHTML);
      }

      function initFlipbook(startPage) {
        const W = $book.width();
        const H = $book.height();

        $fb.turn({
          width: W,
          height: H,
          display: 'single',
          acceleration: true,
          gradients: true,
          duration: 700,
          page: startPage || 1,
          when: {
            turning: function (e, page) { syncUI(page); },
            turned: function (e, page) { syncUI(page); }
          }
        });

        TOTAL = $fb.turn('pages');
        syncUI(startPage || 1);
      }

      function buildDots() {
        $('#prjProgress').empty();
        for (let i = 0; i < TOTAL; i++) {
          const dot = $('<div class="prj-pdot"></div>');
          if (i === 0) dot.addClass('active');
          $('#prjProgress').append(dot);
        }
        dotsBuilt = true;
      }

      function isDesktop() {
        return window.innerWidth > 940;
      }

      if (isDesktop()) {
        initFlipbook(1);
        document.getElementById('prjBook').classList.add('is-ready');
        buildDots();
      }

      $('#btnNext').on('click', function () { $fb.turn('next'); });
      $('#btnPrev').on('click', function () { $fb.turn('previous'); });

      $(document).on('keydown', function (e) {
        if (!isDesktop()) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') $fb.turn('next');
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') $fb.turn('previous');
      });

      const $viewBtn = $('#prjViewBtn');
      const $extras = $('.prj-list-item--extra');
      let expanded = false;

      $viewBtn.on('click', function () {
        expanded = !expanded;
        if (expanded) {
          $extras.addClass('is-visible');
          $viewBtn.html('Show less <i class="fa-solid fa-arrow-up"></i>');
          $viewBtn.addClass('is-expanded');
        } else {
          $extras.removeClass('is-visible');
          $viewBtn.html('View all <i class="fa-solid fa-arrow-down"></i>');
          $viewBtn.removeClass('is-expanded');
        }
      });

      let wasDesktop = isDesktop();
      let resizeTimer;

      $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          const nowDesktop = isDesktop();

          if (nowDesktop) {
            let currentPage = 1;
            try { currentPage = $fb.turn('page'); } catch (e) {}
            destroyFlipbook();
            initFlipbook(currentPage);
            document.getElementById('prjBook').classList.add('is-ready');
            if (!dotsBuilt) buildDots();
          } else if (wasDesktop && !nowDesktop) {
            destroyFlipbook();
          }

          wasDesktop = nowDesktop;
        }, 200);
      });
    });
  });
}
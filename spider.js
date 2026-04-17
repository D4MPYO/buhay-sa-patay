/* spider.js — cobweb + animated spider for mananaliksik page */
(function () {

  /* ══════════════════════════════
     SHARED DRAWING FUNCTIONS
  ══════════════════════════════ */
  function drawCornerWeb(ctx, cx, cy, radius, strands, rings, flipX) {
    ctx.save();
    if (flipX) { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
    var spread = Math.PI * 0.52;
    ctx.strokeStyle = 'rgba(210,200,170,0.13)';
    ctx.lineWidth   = 0.6;
    for (var s = 0; s <= strands; s++) {
      var a = (spread / strands) * s;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
      ctx.stroke();
    }
    for (var r = 1; r <= rings; r++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (radius / rings) * r, 0, spread);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSpider(ctx, x, y, sz, legPhase) {
    ctx.save();
    ctx.translate(x, y);
    /* abdomen */
    ctx.fillStyle   = 'rgba(18,12,6,0.92)';
    ctx.strokeStyle = 'rgba(180,150,80,0.55)';
    ctx.lineWidth   = 0.7;
    ctx.beginPath();
    ctx.ellipse(0, sz * 0.38, sz * 0.52, sz * 0.68, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    /* cephalothorax */
    ctx.beginPath();
    ctx.ellipse(0, -sz * 0.28, sz * 0.42, sz * 0.46, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    /* eyes */
    ctx.fillStyle = 'rgba(210,175,55,0.95)';
    ctx.beginPath(); ctx.arc(-sz*0.14, -sz*0.38, sz*0.09, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc( sz*0.14, -sz*0.38, sz*0.09, 0, Math.PI*2); ctx.fill();
    /* legs */
    ctx.strokeStyle = 'rgba(15,10,4,0.9)';
    ctx.lineWidth   = 0.9;
    var offsets = [
      {oy:-sz*0.18,baseA:0.35},{oy:-sz*0.02,baseA:0.55},
      {oy: sz*0.14,baseA:0.72},{oy: sz*0.28,baseA:0.88}
    ];
    offsets.forEach(function(o, i) {
      var wave = (i%2===0) ? Math.sin(legPhase) : Math.sin(legPhase+Math.PI);
      var anim = wave * 0.12;
      var la = -(Math.PI*0.5 + o.baseA + anim);
      var lx1 = Math.cos(la)*sz*0.95, ly1 = Math.sin(la)*sz*0.95;
      ctx.beginPath(); ctx.moveTo(-sz*0.28,o.oy);
      ctx.lineTo(lx1,ly1);
      ctx.lineTo(lx1+Math.cos(la-0.45)*sz*1.05, ly1+Math.sin(la-0.45)*sz*1.05);
      ctx.stroke();
      var ra = -(Math.PI*0.5 - o.baseA - anim);
      var rx1 = Math.cos(ra)*sz*0.95, ry1 = Math.sin(ra)*sz*0.95;
      ctx.beginPath(); ctx.moveTo(sz*0.28,o.oy);
      ctx.lineTo(rx1,ry1);
      ctx.lineTo(rx1+Math.cos(ra+0.45)*sz*1.05, ry1+Math.sin(ra+0.45)*sz*1.05);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawSilk(ctx, ax, ay, sx, sy) {
    ctx.strokeStyle = 'rgba(215,205,175,0.32)';
    ctx.lineWidth   = 0.7;
    ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(sx,sy); ctx.stroke();
  }

  /* ══════════════════════════════
     SCENE: lapida-grid section
  ══════════════════════════════ */
  var grid = document.querySelector('.lapida-grid');
  if (grid) {
    var pageCanvas = document.createElement('canvas');
    pageCanvas.id  = 'spider-canvas';
    pageCanvas.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;' +
      'pointer-events:none;z-index:0;';
    var wrap = grid.parentElement;
    if (getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
    wrap.insertBefore(pageCanvas, wrap.firstChild);
    var pctx = pageCanvas.getContext('2d');

    function resizePage() {
      pageCanvas.width  = wrap.offsetWidth;
      pageCanvas.height = wrap.offsetHeight;
    }
    resizePage();
    window.addEventListener('resize', resizePage);

    function framePage(ts) {
      var t  = ts/1000;
      var w  = pageCanvas.width, h = pageCanvas.height;
      pctx.clearRect(0,0,w,h);
      var webR = Math.min(w,h)*0.32;
      drawCornerWeb(pctx,0,0,webR,8,5,false);
      drawCornerWeb(pctx,w,0,webR,8,5,true);
      var aX = w*0.5, tL = Math.min(h*0.3,160);
      var ang = (35/tL)*Math.sin(t*0.7);
      var sX = aX + Math.sin(ang)*tL;
      var sY =      Math.cos(ang)*tL;
      drawSilk(pctx,aX,0,sX,sY);
      drawSpider(pctx,sX,sY,9,t*2.8);
      requestAnimationFrame(framePage);
    }
    requestAnimationFrame(framePage);
  }

  /* ══════════════════════════════
     SCENE: each modal box
  ══════════════════════════════ */
  document.querySelectorAll('.modal-spider-canvas').forEach(function(mc) {
    var mctx  = mc.getContext('2d');
    var box   = mc.parentElement;
    var rafId = null;
    var isGold = box.classList.contains('researcher-modal__box--gold');

    function resizeModal() {
      mc.width  = box.offsetWidth;
      mc.height = box.offsetHeight;
    }

    function frameModal(ts) {
      var t  = ts/1000;
      var w  = mc.width, h = mc.height;
      mctx.clearRect(0,0,w,h);
      /* corner webs — all 4 corners, smaller */
      var webR = Math.min(w,h)*0.28;
      drawCornerWeb(mctx,0,0,webR,6,4,false);   /* top-left    */
      drawCornerWeb(mctx,w,0,webR,6,4,true);    /* top-right   */

      /* small spider crawling along top edge */
      var crawlX = (w*0.1) + (w*0.8) * ((Math.sin(t*0.4)+1)/2);
      var crawlY = 14 + Math.sin(t*1.8)*5;
      drawSilk(mctx, crawlX, 0, crawlX, crawlY);
      drawSpider(mctx, crawlX, crawlY, 6, t*3.2);

      rafId = requestAnimationFrame(frameModal);
    }

    /* Start when modal opens, stop when closed to save resources */
    var modalEl = box.closest('.researcher-modal');
    if (modalEl) {
      var observer = new MutationObserver(function() {
        if (modalEl.classList.contains('is-open')) {
          resizeModal();
          if (!rafId) rafId = requestAnimationFrame(frameModal);
        } else {
          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
          mctx.clearRect(0,0,mc.width,mc.height);
        }
      });
      observer.observe(modalEl, { attributes: true, attributeFilter: ['class'] });
    }
  });

})();
(function ($) {
    "use strict";
    // DOM Ready

    var changetext = function () {
        if ($(".text-color-change").length) {
            $(".text-color-change").each(function () {
                const $el = $(this)[0];

                $el.wordSplit?.revert();
                $el.charSplit?.revert();

                $el.wordSplit = new SplitText($el, { type: "words", wordsClass: "word-wrapper" });
                $el.charSplit = new SplitText($el.wordSplit.words, { type: "chars", charsClass: "char-wrapper" });

                gsap.set($el.charSplit.chars, { color: "#FFFFFF52" });

                gsap.to($el.charSplit.chars, {
                    color: "#ffffff",
                    stagger: { each: 0.03, from: "start" },
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: $el,
                        start: "top 70%",
                        end: "bottom 20%",
                        scrub: true,
                        toggleActions: "play none none reverse",
                    },
                });
            });
        }
    };

    var gsapA2 = () => {
        if ($(".gsap-anime-2").length) {
            const cards = document.querySelectorAll(".flip-image");

            function animate() {
                const isMobile = window.innerWidth < 767;
                const cardW = isMobile ? 150 : 325;
                const cardH = isMobile ? 150 : 325;

                const parent = cards[0].parentElement;
                parent.style.position = "relative";
                const centerX = parent.clientWidth / 2 - cardW / 2;
                const centerY = parent.clientHeight / 2 - cardH / 2;

                cards.forEach((card, i) => {
                    card.style.position = "absolute";
                    card.style.zIndex = i + 1;
                });

                const tl = gsap.timeline({
                    defaults: { ease: "power3.out" },
                    scrollTrigger: {
                        trigger: ".gsap-anime-2",
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                });

                tl.to(cards, {
                    x: centerX,
                    y: centerY,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                }).to(cards, {
                    x: (i) => {
                        if (i === 0) return centerX - (isMobile ? 180 : 400);
                        if (i === 1) return centerX - (isMobile ? 110 : 240);
                        if (i === 2) return centerX - (isMobile ? 40 : 80);
                        if (i === 3) return centerX + (isMobile ? 40 : 80);
                        if (i === 4) return centerX + (isMobile ? 110 : 240);
                        if (i === 5) return centerX + (isMobile ? 180 : 400);
                        return centerX;
                    },
                    y: (i) => {
                        if (i === 0) return centerY - (isMobile ? 120 : 300);
                        if (i === 1) return centerY - (isMobile ? 70 : 180);
                        if (i === 2) return centerY - (isMobile ? 25 : 60);
                        if (i === 3) return centerY + (isMobile ? 25 : 60);
                        if (i === 4) return centerY + (isMobile ? 70 : 180);
                        if (i === 5) return centerY + (isMobile ? 120 : 300);
                        return centerY;
                    },
                    rotation: -10,
                    rotateX: 4,
                    rotateY: 10,
                    duration: 1,
                    ease: "power2.out",
                    delay: 0.3,
                });
            }

            animate();

            window.addEventListener("resize", () => {
                gsap.killTweensOf(".flip-image");
                animate();
            });
        }
    };

    var stackElement = function () {
        if ($(".stack-element").length > 0) {
            let scrollTriggerInstances = [];

            const updateTotalHeight = () => {
                const containerHeight = $(".stack-element-main").outerHeight();

                scrollTriggerInstances.forEach((instance) => instance.kill());
                scrollTriggerInstances = [];

                const elements = document.querySelectorAll(".element:not(:last-child)");

                elements.forEach((element, index) => {
                    const elementHeight = element.offsetHeight;

                    const pinTrigger = ScrollTrigger.create({
                        trigger: element,
                        scrub: 1,
                        start: "top top+=30",
                        end: `+=${containerHeight - elementHeight}`,
                        pin: true,
                        pinSpacing: false,
                        animation: gsap.to(element, {
                            scale: 0.9,
                            opacity: 0,
                        }),
                    });

                    scrollTriggerInstances.push(pinTrigger);
                });
            };

            updateTotalHeight();

            let resizeTimeout;
            window.addEventListener("resize", () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(updateTotalHeight, 150);
            });
        }
    };
    function stackElement2() {
        const container = document.querySelector(".stack-element-2");
        if (!container) return;

        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        ScrollTrigger.getAll().forEach((st) => st.kill());

        ScrollTrigger.matchMedia({
            "(min-width: 992px)": () => {
                const elements = container.querySelectorAll(".element");

                let totalHeight = 0;
                elements.forEach((el, i) => {
                    if (i > 0) totalHeight += el.offsetHeight;
                });

                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container,
                        start: "top top",
                        end: "+=" + totalHeight,
                        scrub: true,
                        pin: true,
                        invalidateOnRefresh: true,
                    },
                });

                elements.forEach((el, i) => {
                    if (i === 0) return;
                    tl.fromTo(el, { y: "100%" }, { y: "0%", duration: el.offsetHeight / totalHeight });
                });

                const st = tl.scrollTrigger;

                if (!container._stackBound) {
                    container.addEventListener("click", (e) => {
                        const action = e.target.closest(".action");
                        if (!action) return;

                        const el = action.closest(".element");
                        const idx = Array.from(elements).indexOf(el);
                        if (idx === -1) return;

                        let nextIndex = idx < elements.length - 1 ? idx + 1 : idx - 1;

                        const progressPer = 1 / (elements.length - 1);
                        const targetProgress = progressPer * nextIndex;

                        const targetScroll = st.start + (st.end - st.start) * targetProgress;

                        gsap.to(window, {
                            duration: 0.6,
                            scrollTo: targetScroll,
                            ease: "power2.out",
                            onStart: () => (st.scrub = false),
                            onComplete: () => (st.scrub = true),
                        });
                    });

                    container._stackBound = true;
                }
            },

            "(max-width: 991px)": () => {
                const elements = container.querySelectorAll(".element");
                elements.forEach((el) => gsap.set(el, { clearProps: "all" }));
            },
        });
    }

    var scrollSmooth = () => {
        if ($("#smooth-wrapper").length > 0) {
            let smoother = ScrollSmoother.create({
                smooth: 2,
                smoothTouch: 0.1,
                effects: true,
            });
        }
    };

    var scrollEffectFade = () => {
        if ($(".effectFade").length) {
            gsap.registerPlugin(ScrollTrigger);

            document.querySelectorAll(".effectFade").forEach((el) => {
                let fromVars = { autoAlpha: 0 };
                let toVars = { autoAlpha: 1, duration: 1, ease: "power3.out" };
                let wrapper = null;
                let startPush = "top 95%";
                let delay = el.dataset.delay ? parseFloat(el.dataset.delay) : 0;
                toVars.delay = delay;

                if (el.classList.contains("fadeUp") && !el.classList.contains("no-div")) {
                    wrapper = document.createElement("div");
                    wrapper.classList.add("overflow-hidden");
                    el.parentNode.insertBefore(wrapper, el);
                    wrapper.appendChild(el);
                }

                if (el.classList.contains("no-div")) {
                    wrapper = null;
                }
                if (el.classList.contains("fadeUp")) {
                    fromVars.y = 50;
                    toVars.y = 0;
                } else if (el.classList.contains("fadeDown")) {
                    fromVars.y = -50;
                    toVars.y = 0;
                } else if (el.classList.contains("fadeLeft")) {
                    fromVars.x = -50;
                    toVars.x = 0;
                } else if (el.classList.contains("fadeRight")) {
                    fromVars.x = 50;
                    toVars.x = 0;
                } else if (el.classList.contains("fadeRotateX")) {
                    fromVars.rotationX = 45;
                    fromVars.yPercent = 100;
                    fromVars.transformOrigin = "top center -50";
                    toVars.rotationX = 0;
                    toVars.yPercent = 0;
                    toVars.transformOrigin = "top center -50";
                    toVars.duration = 1;
                    toVars.ease = "power3.out";
                    if (wrapper) {
                        wrapper.style.perspective = "400px";
                    }
                } else if (el.classList.contains("fadeZoom")) {
                    fromVars.scale = 0.8;
                    toVars.scale = 1;
                }

                if (el.classList.contains("view-visible")) {
                    startPush = "top 101%";
                }

                gsap.set(el, fromVars);

                gsap.to(el, {
                    ...toVars,
                    scrollTrigger: {
                        trigger: el,
                        start: startPush,
                        toggleActions: "play none none none",
                    },
                });
            });
        }
    };

    var loader = function () {
        if ($(".preloader").length) {
            var innerBars = document.querySelectorAll(".inner-bar");
            var increment = 0;

            function animateBars() {
                for (var i = 0; i < 2; i++) {
                    var randomWidth = Math.floor(Math.random() * 101);
                    gsap.to(innerBars[i + increment], {
                        width: randomWidth + "%",
                        duration: 0.3,
                        ease: "none",
                    });
                }

                gsap.delayedCall(0.3, function () {
                    for (var i = 0; i < 2; i++) {
                        gsap.to(innerBars[i + increment], {
                            width: "100%",
                            duration: 0.3,
                            ease: "none",
                        });
                    }

                    increment += 2;

                    if (increment < innerBars.length) {
                        animateBars();
                    } else {
                        var preloaderTL = gsap.timeline({
                            onComplete: () => {
                                $(".preloader").remove();
                                runAnimations();
                            },
                        });

                        preloaderTL.to(".preloader", {
                            "--preloader-clip": "100%",
                            duration: 0.3,
                            ease: "none",
                        });
                    }
                });
            }

            // Com <script defer>, o evento "load" pode já ter disparado antes deste
            // ponto; nesse caso inicia o preloader imediatamente em vez de esperar.
            if (document.readyState === "complete") {
                animateBars();
            } else {
                $(window).on("load", function () {
                    animateBars();
                });
            }
        } else {
            runAnimations();
        }
    };

    var mouseHover = () => {
        if ($(".main-mouse-hover").length > 0) {
            $(".main-mouse-hover").each(function () {
                const $container = $(this);
                const $mouseEl = $container.find(".tf-mouse");

                let currentX, currentY, targetX, targetY;
                let animationFrame;

                if (!$mouseEl.hasClass("mode-2")) {
                    currentX = $container.width() / 2;
                    currentY = $container.height() / 2;
                    targetX = currentX;
                    targetY = currentY;

                    $mouseEl.css({ left: currentX + "px", top: currentY + "px" });
                }

                $container.on("mouseenter", function () {
                    $mouseEl.addClass("hover");
                    if ($mouseEl.hasClass("mode-2")) {
                        $mouseEl.css({ opacity: 1 });
                    }
                });

                $container.on("mousemove", function (e) {
                    const rect = this.getBoundingClientRect();
                    targetX = e.clientX - rect.left;
                    targetY = e.clientY - rect.top;

                    if ($mouseEl.hasClass("mode-2") && currentX === null) {
                        currentX = targetX;
                        currentY = targetY;
                    }

                    if (!animationFrame) animate();
                });

                $container.on("mouseleave", function () {
                    $mouseEl.removeClass("hover");
                    if ($mouseEl.hasClass("mode-2")) {
                        $mouseEl.css({ opacity: 0 });
                    } else {
                        targetX = $container.width() / 2;
                        targetY = $container.height() / 2;
                        if (!animationFrame) animate();
                    }
                });

                function animate() {
                    currentX += (targetX - currentX) * 0.1;
                    currentY += (targetY - currentY) * 0.1;

                    $mouseEl.css({ left: currentX + "px", top: currentY + "px" });

                    if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
                        animationFrame = requestAnimationFrame(animate);
                    } else {
                        animationFrame = null;
                    }
                }
            });
        }
    };

    var animateBox = () => {
        if ($(".animate-box").length > 0) {
            gsap.registerPlugin(ScrollTrigger);
            gsap.fromTo(
                ".animate-box",
                { x: -400, y: -100, scale: 0.1 },
                {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".animate-box",
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }
    };

    var serviceScroll = () => {
        const $section = $(".section-service-2");
        const $bgList = $(".bg-image-list");
        const $bg = $bgList.find(".bg-image");

        if (!$section.length) return;

        gsap.registerPlugin(ScrollTrigger);

        let mode = null;
        let tl = null;
        let stInstance = null;
        let isNavigating = false;

        function debounce(fn, wait = 100) {
            let timeout;
            return function (...args) {
                const ctx = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => fn.apply(ctx, args), wait);
            };
        }

        const detectAnchorNavigation = () => {
            $('a[href^="#"]').on("click", function (e) {
                const targetId = $(this).attr("href");
                const $target = $(targetId);

                if ($target.length) {
                    isNavigating = true;

                    setTimeout(() => {
                        isNavigating = false;
                    }, 1500);
                }
            });

            if (window.location.hash) {
                isNavigating = true;
                setTimeout(() => {
                    isNavigating = false;
                }, 1500);
            }
        };

        const initDesktop = () => {
            const $mainScrolls = $section.find(".wg-service-2");

            $mainScrolls.css("pointer-events", "none");
            $mainScrolls.eq(0).css("pointer-events", "auto");

            tl = gsap.timeline({ paused: true });

            $mainScrolls.each(function (i, el) {
                const $main = $(el);
                const $itemImage = $main.find(".image-2");
                const $next = $mainScrolls.eq(i + 1);
                const $bgCurrent = $bg.eq(i);
                const $bgNext = $bg.eq(i + 1);

                if ($next.length) {
                    if ($itemImage.length) {
                        tl.to($itemImage, {
                            left: 0,
                            width: 424,
                            height: 530,
                            opacity: 0,
                            duration: 1,
                            ease: "power2.out",
                        });
                    }

                    tl.to(
                        $main,
                        {
                            opacity: 0,
                            duration: 0.8,
                            ease: "power2.out",
                            onStart: () => {
                                $main.css("pointer-events", "none");
                            },
                            onReverseComplete: () => {
                                $main.css("pointer-events", "auto");
                            },
                        },
                        "<"
                    );

                    tl.fromTo(
                        $next,
                        { scale: 0.95, opacity: 0 },
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 1,
                            ease: "power2.out",
                            onStart: () => {
                                $next.css("pointer-events", "auto");
                            },
                            onReverseComplete: () => {
                                $next.css("pointer-events", "none");
                            },
                        },
                        "<"
                    );

                    if ($bgCurrent.length && $bgNext.length) {
                        tl.to(
                            $bgCurrent,
                            {
                                opacity: 0,
                                duration: 1,
                                ease: "power2.out",
                            },
                            "<"
                        );

                        tl.fromTo(
                            $bgNext,
                            { opacity: 0 },
                            {
                                opacity: 1,
                                duration: 1,
                                ease: "power2.out",
                            },
                            "<"
                        );
                    }
                }
            });

            const totalSteps = $mainScrolls.length - 1;
            const stepLength = 1 / totalSteps;
            let currentStep = 0;
            let isAnimating = false;
            let lastScrollTime = Date.now();
            let scrollVelocity = 0;

            const startValue = window.innerWidth < 1600 ? "top top" : "top top";

            stInstance = ScrollTrigger.create({
                trigger: $section[0],
                start: startValue,
                end: "+=" + totalSteps * 1000,
                pin: true,
                scrub: false,
                markers: false,
                anticipatePin: 1,
                onUpdate: (self) => {
                    if (isNavigating) {
                        return;
                    }

                    const now = Date.now();
                    const timeDelta = now - lastScrollTime;
                    const progressDelta = Math.abs(self.progress - currentStep * stepLength);
                    scrollVelocity = progressDelta / (timeDelta || 1);
                    lastScrollTime = now;

                    const progress = self.progress;
                    const targetStep = Math.round(progress * totalSteps);

                    if (targetStep !== currentStep) {
                        if (isAnimating && scrollVelocity > 0.001) {
                            self.scroll(self.start + (currentStep / totalSteps) * (self.end - self.start));
                            return;
                        }

                        if (!isAnimating) {
                            isAnimating = true;
                            const oldStep = currentStep;
                            currentStep = targetStep;
                            const distance = Math.abs(targetStep - oldStep);
                            const baseDuration = 1;
                            const duration = baseDuration * Math.min(distance, 1.2);

                            tl.tweenTo(currentStep * stepLength * tl.duration(), {
                                duration: duration,
                                ease: "power2.inOut",
                                onComplete: () => {
                                    isAnimating = false;
                                },
                            });
                        }
                    }
                },
            });

            detectAnchorNavigation();
        };

        const destroyDesktop = () => {
            if (stInstance) {
                stInstance.kill();
                stInstance = null;
            }

            if (tl) {
                tl.kill();
                tl = null;
            }

            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === $section[0]) {
                    st.kill();
                }
            });

            $section.find(".wg-service-2, .image-2").removeAttr("style");
            $section.find(".wg-service-2").css({
                opacity: "",
                transform: "",
                "pointer-events": "",
            });
            $section.find(".image-2").css({
                opacity: "",
                transform: "",
                left: "",
                width: "",
                height: "",
            });

            $section.removeAttr("style");
            ScrollTrigger.refresh();
        };

        const checkAndInit = () => {
            if (window.innerWidth >= 1200) {
                if (mode !== "desktop") {
                    destroyDesktop();
                    initDesktop();
                    mode = "desktop";
                }
            } else {
                if (mode !== "mobile") {
                    destroyDesktop();
                    mode = "mobile";
                }
            }
        };

        checkAndInit();
        $(window).on("resize", debounce(checkAndInit, 300));
    };

    var runAnimations = () => {
        serviceScroll();
        stackElement();
        scrollSmooth();
        stackElement2();
        gsapA2();
        changetext();
        scrollEffectFade();
        mouseHover();
        animateBox();
    };

    $(function () {
        loader();
    });

    $(window).on("load", function () {
        const hash = window.location.hash;
        if (hash && $(hash).length) {
            setTimeout(() => {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: hash,
                    ease: "power2.out",
                });
            }, 800);
        }
    });
})(jQuery);

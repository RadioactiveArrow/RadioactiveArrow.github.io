
active = false;
$(document).ready(async function() {
    $("#expand").click(async function(e){
        active =true
        e.preventDefault()
        $(".p1").fadeOut(400, "swing")
        $(".name-container").delay(370).animate({
            height: "0px",
          }, 
          { duration: 800,
            complete: async function() {
                await $(".p1-2").typeWrite({
                    speed: 60,
                    repeat: false,
                    cursor: true,
                }, $(".p1-2").text());//fadeIn(700, "swing")
                await setTimeout(async () => {  
                    $("body").css({overflow: "hidden"})
                    $(".p1-3").typeWrite({
                    speed: 60,
                    repeat: false,
                    cursor: true,
                    }, $(".p1-3").text());
                    $("main").css({top: $('main').offset().top + "px", left: $('.nav-bar').offset().left + "px", transform: "none", overflow: "none"})
                    $("main").delay(1500).animate({ top: $('main').offset().top - 180 + "px"} , {duration: 500})
                    $(".name-container").delay(1500).animate({
                        height: "" + ($(window).height() - $('.name-container').offset().top + 180 -1 )  + "px",
                        width: "" + ($(window).width() - $('.name-container').offset().left) + "px",
                        top: "-50px",
                        bottom: "0px",
                        right: "0px"
                        }, { 
                            duration: 500,
                            complete: () => {
                                $(".p2").fadeIn() 
                                $(".name-container").toggleClass("visible-border",false)
                                // $("body").css({overflow:"visible"})
                            }
                    });
                }, 700);    
            }
          }
        );
        
      });
});

console.log("hello world!")

// Debounce
function debounce(func, time){
    var time = time || 100; // 100 by default if no param
    var timer;
    return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func, time, event);
    };
}

// Function with stuff to execute
function resizeContent() {
    if(active) {
        console.log("resized!!")
        $("main").css("left", $('.nav-bar').offset().left + "px")
        $(".name-container").css("width", ($(window).width() - $('.name-container').offset().left) + "px")
    }
}

// Eventlistener
window.addEventListener("resize", debounce( resizeContent, 0 ));
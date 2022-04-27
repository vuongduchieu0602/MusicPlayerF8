//=====
        //1. Render songs
        //2. Scroll top
        //3. Play/ pause/ seel
        //4. CD rotate
        //5. Next/ previous
        //6. Random
        //7. Next/ Repeat when ended
        //8. Actice song
        //9. Scroll active song into view
        //10. Play song when click
        //=====

        const $ = document.querySelector.bind(document);
        const $$ = document.querySelectorAll.bind(document);

        const player = $('.player');
        const cd = $('.cd');
        const heading = $('header h2');
        const cdThumb = $('.cd-thumb');
        const audio = $('#audio');
        const btnPlay = $('.btn-toggle-play');
        const progress = $('#progress');
        const prevBtn = $('.btn-prev');
        const nextBtn = $('.btn-next');
        const randomBtn = $('.btn-random');
        const repeatBtn = $('.btn-repeat');

        const app = {
            currentIndex: 0,
            isPlaying: false,
            isRandom: false,
            isRepeat: false,
            songs: [
                {
                    name: "Cho anh cho em",
                    singer: "Seachains",
                    path: "./assets/music/song1.mp3",
                    image: "./assets/img/song1.jpg"
                },
                {
                    name: "Đông kiếm em",
                    singer: "Vũ",
                    path: "./assets/music/song2.mp3",
                    image: "./assets/img/song2.jpg"
                },
                {
                    name: "Mùa mưa ngâu nằm cạnh",
                    singer: "Vũ",
                    path: "./assets/music/song3.mp3",
                    image: "./assets/img/song3.jpg"
                },
                {
                    name: "Phi hành gia",
                    singer: "Lil wuyn",
                    path: "./assets/music/song4.mp3",
                    image: "./assets/img/song4.jpg"
                },
                {
                    name: "Phút ban đầu",
                    singer: "Vũ",
                    path: "./assets/music/song5.mp3",
                    image: "./assets/img/song5.jpg"
                },
                {
                    name: "Yêu đương khó quá thì chạy về khóc với anh",
                    singer: "ERIK",
                    path: "./assets/music/song6.mp3",
                    image: "./assets/img/song6.jpg"
                },
                {
                    name: "Yêu em hơn mỗi ngày",
                    singer: "Andiez",
                    path: "./assets/music/song7.mp3",
                    image: "./assets/img/song7.jpg"
                }

            ],
            
            render: function(){
                const htmls = this.songs.map((song, index)=>{
                    return `
                        <div class="song ${index === this.currentIndex ? 'active' : ''}">
                            <div class="thumb" style="background-image: url('${song.image}')"></div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `
                });
                $('.playlist').innerHTML = htmls.join('');
            },
            defineProperties: function(){
                Object.defineProperty(this,'currentSong',{
                    get: function(){
                        return this.songs[this.currentIndex];
                    }
                })
            },
            handleEvents: function(){
                const _this = this;
                const cdWidth = cd.offsetWidth;

                //Xử lí CD rotate/ pause
                const cdThumbAnimate = cdThumb.animate([
                    {transform: 'rotate(360deg)'}
                ],{
                    duration: 10000,        //thời gian thực thi
                    interation: Infinity    //số lần lặp
                });
                cdThumbAnimate.pause();

                //Xử lí zoom
                document.onscroll = function(){
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const newCdWidth = cdWidth - scrollTop;
                    
                    cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                    cd.style.opacity = newCdWidth / cdWidth;
                }
                //Xử lí play
                btnPlay.onclick = function(){
                    if(_this.isPlaying){
                        audio.pause();
                    }else{
                        audio.play();
                    }
                }

                //khi audio play
                audio.onplay = function(){
                    _this.isPlaying = true;
                    player.classList.add('playing');
                    cdThumbAnimate.play();
                }
                //khi audio pause
                audio.onpause = function(){
                    _this.isPlaying = false;
                    player.classList.remove('playing');
                    cdThumbAnimate.pause();
                }
                //Progress
                audio.ontimeupdate = function(){
                    if(audio.duration){
                        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                        progress.value = progressPercent;
                    }
                }
                //Set lại progress
                progress.onchange = function(e){
                    const seekTime = audio.duration / 100 * e.target.value;
                    audio.currentTime = seekTime;

                }
                //next
                nextBtn.onclick = function(){
                    if(_this.isRandom)
                    {
                        _this.randomSong();
                    }else{
                        _this.nextSong();
                    }
                    audio.play();
                    _this.render();
                    _this.scrollIntoTopView();
                }
                //prev
                prevBtn.onclick = function(){
                    if(!_this.isRandom)
                    {
                        _this.randomSong();
                    }else{
                        _this.prevSong();
                    }
                    audio.play();
                    _this.render();
                }
                //bật / tắt random
                randomBtn.onclick = function(){
                    _this.isRandom = !_this.isRandom;
                    randomBtn.classList.toggle('active',_this.isRandom);
                }
                //Xử lí repeat
                repeatBtn.onclick = function(e){
                    _this.isRepeat = !_this.isRepeat;
                    repeatBtn.classList.toggle('active', _this.isRepeat);
                }   

                //Xử lí next song khi audio ended
                audio.onended = function(){
                    if(_this.isRepeat){
                        audio.play();
                    }else{
                        nextBtn.click();
                    }
                }
            },
            scrollIntoTopView: function(){
                setTimeout(function(){
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 300)
                
            },
            loadCurrentSong: function(){
                heading.textContent = this.currentSong.name;
                cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
                audio.src = this.currentSong.path;

                console.log(heading, cdThumb, audio);
            },
            nextSong: function(){
                this.currentIndex++;
                console.log(this.currentIndex, this.songs.length)
                if(this.currentIndex >= this.songs.length){
                    this.currentIndex = 0;
                };
                this.loadCurrentSong();
            },
            prevSong: function(){
                this.currentIndex--;
                console.log(this.currentIndex, this.songs.length)
                if(this.currentIndex < 0){
                    this.currentIndex = this.songs.length - 1;
                };
                this.loadCurrentSong();
            },
            randomSong: function(){
                let newIndex;
                do{
                    newIndex = Math.floor(Math.random() * this.songs.length);
                }while(newIndex === this.currentIndex);
                console.log(newIndex);
                console.log(this.currentIndex);
                this.currentIndex = newIndex;
                this.loadCurrentSong();
            },
            start: function(){
                this.defineProperties();

                this.handleEvents();

                this.loadCurrentSong();

                this.render();
            }
        }

        app.start();

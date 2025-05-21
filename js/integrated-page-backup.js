// 闆嗘垚椤甸潰鐨勪富瑕丣avaScript

document.addEventListener('DOMContentLoaded', function() {
    // ===== 鍏ㄥ眬鍙橀噺 =====
    let newsData = null;
    let isTypingComplete = false;
    const nav = document.getElementById('main-nav');
    const titleSection = document.getElementById('title-section');
    
    // ===== 鏍囬椤垫墦瀛楁晥鏋?=====
    const titleText = "鈥滄垜浠牬鑼ц€屽苟闈炴垚铦垛€濓細鍗氬＋鐢熺殑鈥滃欢鈥濅笉鐢辫》";
    const titleElement = document.getElementById('typing-title');
    const authorsElement = document.getElementById('authors');
    const continueHintElement = document.getElementById('continue-hint');
    const cursor = document.querySelector('.cursor');
    
    let charIndex = 0;
    
    // 鎵撳瓧鏁堟灉鍑芥暟
    function typeTitle() {
        if (charIndex < titleText.length) {
            // 鑾峰彇褰撳墠瀛楃
            const currentChar = titleText.charAt(charIndex);
            
            // 娣诲姞瀛楃鍒版爣棰?
            titleElement.innerHTML += currentChar;
            charIndex++;
            
            // 璋冩暣鍏夋爣浣嶇疆
            setTimeout(() => {
                cursor.style.left = (titleElement.offsetWidth) + 'px';
                cursor.style.right = 'auto';
            }, 0);
            
            // 鏍规嵁褰撳墠瀛楃璋冩暣鎵撳瓧閫熷害
            let typingSpeed = 150;
            if ('锛屻€傦細銆?"銆娿€嬶紵锛?.includes(currentChar)) {
                typingSpeed = 400;
            }
            
            setTimeout(typeTitle, typingSpeed);
        } else {
            // 鎵撳瓧瀹屾垚鍚?
            isTypingComplete = true;
            titleSection.classList.add('typing-completed');
            
            // 纭繚鍏夋爣浣嶇疆姝ｇ‘
            cursor.style.left = (titleElement.offsetWidth) + 'px';
            
            // 鏄剧ず浣滆€呬俊鎭?
            setTimeout(() => {
                authorsElement.classList.add('visible');
                
                // 鏄剧ず缁х画闃呰鎻愮ず
                setTimeout(() => {
                    continueHintElement.classList.add('visible');
                    
                    // 鎵撳瓧鏁堟灉瀹屾垚鍚庢樉绀哄鑸爮
                    setTimeout(() => {
                        nav.classList.add('visible');
                    }, 1000);
                }, 1000);
            }, 500);
        }
    }
    
    // ===== 婊氬姩鏁堟灉澶勭悊 =====
    
    // 鐩戝惉婊氬姩浜嬩欢锛屾帶鍒跺鑸爮鏄剧ず/闅愯棌
    let lastScrollY = 0;
    let ticking = false;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // 褰撲笉鍦ㄩ〉闈㈤《閮ㄦ椂鏄剧ず瀵艰埅鏍?
        if (currentScrollY > 100 && isTypingComplete) {
            nav.classList.add('visible');
        } else if (currentScrollY <= 100 && !isTypingComplete) {
            nav.classList.remove('visible');
        }
        
        // 妫€鏌ュ綋鍓嶅湪鍝釜閮ㄥ垎锛屾洿鏂版椿鍔ㄥ鑸」
        updateActiveNavItem();
        
        // 鏍囪宸插鐞嗘婊氬姩浜嬩欢
        ticking = false;
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
    
    // 鏇存柊褰撳墠娲诲姩瀵艰埅椤?
    function updateActiveNavItem() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        // 鑾峰彇鎵€鏈夐儴鍒?
        const sections = [
            document.getElementById('title-section'),
            document.getElementById('intro'),
            document.getElementById('scrolly'),
            document.getElementById('about')
        ];
        
        // 鑾峰彇鎵€鏈夊鑸摼鎺?
        const navLinks = document.querySelectorAll('.menu a');
        
        // 绉婚櫎鎵€鏈夋椿鍔ㄧ被
        navLinks.forEach(link => link.classList.remove('active'));
        
        // 妫€鏌ュ綋鍓嶆粴鍔ㄤ綅缃湪鍝釜閮ㄥ垎
        let currentSectionIndex = 0;
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (!section) continue;
            
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionIndex = i;
                break;
            }
        }
        
        // 鏍囬鍖哄煙鐗规畩澶勭悊瀵艰埅鏍忚儗鏅?
        if (currentSectionIndex === 0) {
            nav.classList.add('at-title-section');
        } else {
            nav.classList.remove('at-title-section');
        }
        
        // 婵€娲诲搴旂殑瀵艰埅閾炬帴
        navLinks[currentSectionIndex].classList.add('active');
    }
    
    // ===== 鏁版嵁鍔犺浇涓庡彲瑙嗗寲 =====
    
    // 鍔犺浇鏁版嵁
    fetch('../data/news_data.json')
        .then(response => response.json())
        .then(data => {
            newsData = data;
            initScrollytelling();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('visualization').innerHTML = `
                <div class="error">
                    <h3>鏁版嵁鍔犺浇閿欒</h3>
                    <p>鏃犳硶鍔犺浇鏁版嵁鏂囦欢銆傝妫€鏌ユ偍鐨勬暟鎹矾寰勩€?/p>
                </div>
            `;
        });
    
    // 鍒濆鍖栨粴鍔ㄨ鏁呬簨鍔熻兘
    function initScrollytelling() {
        const scroller = scrollama();
        
        scroller
            .setup({
                step: '#scrolly .step',
                offset: 0.5,
                debug: false
            })
            .onStepEnter(handleStepEnter)
            .onStepExit(handleStepExit);
        
        // 鍝嶅簲绐楀彛璋冩暣澶у皬
        window.addEventListener('resize', scroller.resize);
        
        // 澶勭悊杩涘叆姝ラ鐨勫嚱鏁?
        function handleStepEnter(response) {
            // 娣诲姞婵€娲荤被
            response.element.classList.add('is-active');
            
            // 鏍规嵁涓嶅悓鐨勬楠ゆ洿鏂板彲瑙嗗寲
            updateVisualization(response.index);
        }
        
        // 澶勭悊閫€鍑烘楠ょ殑鍑芥暟
        function handleStepExit(response) {
            // 绉婚櫎婵€娲荤被
            response.element.classList.remove('is-active');
        }
        
        // 鏇存柊鍙鍖栧嚱鏁?       function updateVisualization(stepIndex) {
            const viz = document.getElementById('visualization');
            
            if (!newsData || !newsData.sections || stepIndex >= newsData.sections.length) {
                viz.innerHTML = '<p>No data available for this step</p>';
                return;
            }
            
            const section = newsData.sections[stepIndex];
            
            // 鑾峰彇褰撳墠婵€娲荤殑step鍏冪礌鏉ユ鏌ュ畠鏄惁鏈夎嚜宸辩殑鍐呭
            const activeStep = document.querySelector('.step.is-active');
            const hasHtmlContent = activeStep && activeStep.innerHTML.trim().length > 0;
            
            // 娓呯┖涔嬪墠鐨勫唴瀹?
            viz.innerHTML = '';
            
            // 鏍规嵁鏁版嵁绫诲瀷閫夋嫨鍙鍖?
            if (section.data.type === 'chart') {
                // 鍥捐〃绫诲瀷
                viz.style.backgroundImage = '';
                viz.style.backgroundColor = '#2a2a2a';
                
                // 娣诲姞鏍囬
                const titleEl = document.createElement('h3');
                titleEl.textContent = section.title;
                viz.appendChild(titleEl);
                
                const chartContainer = document.createElement('div');
                chartContainer.className = 'chart-container';
                viz.appendChild(chartContainer);
                
                // 濡傛灉宸茬粡鍔犺浇浜哻hart.js鏂囦欢锛屼娇鐢ㄥ叾涓殑鍑芥暟
                if (section.data.chartType === 'line' && typeof createLineChart === 'function') {
                    createLineChart(chartContainer, section.data.values);
                } else if (section.data.chartType === 'bar' && typeof createBarChart === 'function') {
                    createBarChart(chartContainer, section.data.values);
                } else {
                    chartContainer.innerHTML = `<p>鍥捐〃绫诲瀷: ${section.data.chartType}</p>
                        <p>鏁版嵁鍊? ${JSON.stringify(section.data.values)}</p>`;
                }
                
                // 鍙湁褰揌TML姝ラ涓病鏈夊唴瀹规椂锛屾墠娣诲姞JSON涓殑鍐呭
                if (!hasHtmlContent) {
                    const contentSection = document.createElement('div');
                    contentSection.className = 'content-section';
                    contentSection.innerHTML = section.content;
                    viz.appendChild(contentSection);
                }
            } else if (section.data.type === 'image') {
                // 鍥剧墖绫诲瀷 - 璁剧疆涓鸿儗鏅浘鐗?
                viz.style.backgroundImage = `url('${section.data.value}')`;
                viz.style.backgroundSize = 'contain';
                viz.style.backgroundPosition = 'center';
                viz.style.backgroundRepeat = 'no-repeat';
                viz.style.backgroundColor = 'transparent';
                
                // 鍙湁褰揌TML姝ラ涓病鏈夊唴瀹规椂锛屾墠娣诲姞JSON涓殑鍐呭瑕嗙洊灞?
                if (!hasHtmlContent) {
                    const contentOverlay = document.createElement('div');
                    contentOverlay.className = 'content-overlay';
                    contentOverlay.innerHTML = section.content;
                    viz.appendChild(contentOverlay);
                }
            } else {
                // 鏂囨湰绫诲瀷鏁版嵁
                viz.style.backgroundImage = '';
                viz.style.backgroundColor = '#2a2a2a';
                
                // 娣诲姞鏍囬
                const titleEl = document.createElement('h3');
                titleEl.textContent = section.title;
                viz.appendChild(titleEl);
                
                // 娣诲姞鏂囨湰鍐呭
                const textContent = document.createElement('div');
                textContent.className = 'text-content';
                textContent.textContent = section.data.value;
                viz.appendChild(textContent);
                
                // 鍙湁褰揌TML姝ラ涓病鏈夊唴瀹规椂锛屾墠娣诲姞JSON涓殑鍐呭
                if (!hasHtmlContent) {
                    const contentSection = document.createElement('div');
                    contentSection.className = 'content-section';
                    contentSection.innerHTML = section.content;
                    viz.appendChild(contentSection);
                }
            }
        }    }
    
    // ===== 骞虫粦瀵艰埅 =====
    // 骞虫粦婊氬姩瀵艰埅
    document.querySelectorAll('.menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 璁＄畻鐩爣浣嶇疆锛岃€冭檻瀵艰埅鏍忛珮搴?
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 鏇存柊URL浣嗕笉褰卞搷婊氬姩浣嶇疆
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // ===== 鍒濆鍖?=====
    
    // 绋嶅井寤惰繜鍚庡紑濮嬫墦瀛楁晥鏋?
    setTimeout(typeTitle, 1000);
});

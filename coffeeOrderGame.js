/*
- 주문시 커피 queue가 쌓임.
- 커피 주문시 랜덤으로 용량이 정해짐.(FIFO)
- 아무것도 하지않는 알바가 queue를 가져감.
- 알바1, 알바2 숙련도(=속도)가 다름. - 작업 속도는 커피 용량(tall/grande/venti)에 따라 또 다름.
- 커피 주문 버튼 클릭시 주문
- 알바 추가 버튼 클릭시 알바 1명 생성 / 해고시 알바 1명 제거
- tall/grande/venti 세종류 커피가 있고 가격이 다름.
- 매상 계산 : 알바가 작업이 끝난 후
*/

// 커피 주문 종류
let coffeeOrderSort = [
    { 
        menu: 'Americano',
        amount: 'tall',
        makingTime: 100,
        price: 5000 
    },
    { 
        menu: 'Americano',
        amount: 'grande',
        makingTime: 500,
        price: 6000 
    },
    { 
        menu: 'Americano',
        amount: 'venti',
        makingTime: 1000,
        price: 7000 
    },
    { 
        menu: 'Latte',
        amount: 'tall',
        makingTime: 100,
        price: 5500 
    },
    { 
        menu: 'Latte',
        amount: 'grande',
        makingTime: 500,
        price: 6500 
    },
    { 
        menu: 'Latte',
        amount: 'venti',
        makingTime: 1000,
        price: 7500 
    },
    { 
        menu: 'Espresso',
        amount: 'tall',
        makingTime: 100,
        price: 4000 
    },
    { 
        menu: 'Espresso',
        amount: 'grande',
        makingTime: 500,
        price: 5000 
    },
    { 
        menu: 'Espresso',
        amount: 'venti',
        makingTime: 1000,
        price: 6000 
    }
];


// 아르바이트생 배열
let partTimers = [
    { 
        // name: '알바1',
        workingTime: 5,
        status: '쉬고 있음' 
    },
    { 
        // name: '알바2',
        workingTime: 10,
        status: '쉬고 있음' 
    }
];

let partTimerWrap = document.querySelector('.parttimer-wrap');
let hireBtn = document.querySelector('.hire-btn');
let fireBtn = document.querySelector('.fire-btn');
let orderBtn = document.querySelector('.order-btn');

// 알바 배열 화면에 집어넣기 함수
function makePartTimer(){
    partTimerWrap.innerHTML = '';

    partTimers.forEach((item, idx) => {
        partTimerWrap.insertAdjacentHTML('beforeend', `
            <div class="parttimer">
                <p class="parttimer-name">알바 <span class="parttimer-idx">${idx+1}</span></p>
                <p class="parttimer-mode">상태 : <span class="parttimer-status">${item['status']}</span></p>
                <p class="parttimer-skill">제조 시간 : <span class="parttimer-time">${item['workingTime']}</span></p>
            </div>
        `);
    });
}

document.addEventListener("DOMContentLoaded", function(){
    makePartTimer();
});

// 알바 고용 버튼 클릭시
hireBtn.addEventListener('click', () => {

    let newPartTimer = {};

    /*
    // 생성시 알바1, 알바2.. 만드는 순서대로 이름+인덱스-1 지정
    if(partTimers.length == 0){
        newPartTimer['name'] = '알바' + 1;
    }else {
        let lastPTName = partTimers[partTimers.length - 1]['name'];
        let lastPTIdx = Number(lastPTName.slice(2));
        newPartTimer['name'] = '알바' + (lastPTIdx + 1);
    }
    */

    newPartTimer['workingTime'] = Math.floor(Math.random()*10 +1); // 최소값 1 최대값 10
    newPartTimer['status'] = '쉬고 있음';

    partTimers.push(newPartTimer);

    // 새 알바 배열 화면에 집어넣기
    makePartTimer();
});

// 알바 해고 버튼 클릭시
fireBtn.addEventListener('click', () => {

    if(partTimers.length == 0){
        alert('해고할 사람이 없습니다.');
        return;
    }

    let firePrompt = prompt("해고할 사람의 순서를 입력해주세요.", "");
    let firedPTIdx = Number(firePrompt);

    let count = 0;
    /*
    // 입력한 이름의 알바 해고
    partTimers.forEach(function(item){
        if(item['name'] == firedPTName){
            let firedPTIdx = Number(firedPTName.slice(2));
            partTimers.splice(firedPTIdx - 1, 1);
            alert("해고되었습니다.");
            count++;
        }
    })
    */
    if(firedPTIdx){
        for(let i = 0; i < partTimers.length; i++){
            if(firedPTIdx - 1 == i){
                partTimers.splice(i, 1);
                alert("해고되었습니다.");
                count++;
                console.log(partTimers);
            }
        }
        if(count == 0){
            alert("일치하는 사람이 없습니다.");
            return;
        }
    }
    

    // 새 알바 배열 화면에 집어넣기
    makePartTimer();

});


// 커피 주문 버튼 클릭시 주문 쌓임
let coffeeQueue = [];
let orderTable = document.querySelector('.order-wrap');

orderBtn.addEventListener('click', () => {

    if(partTimers.length == 0){
        alert('커피를 제조할 알바가 없습니다. 조금만 기다려주세요.');
        return;
    }

    // coffeeQueue에 새 order 추가
    let randomNum = (coffeeOrderSort) => Math.floor(Math.random() * coffeeOrderSort.length);
    let newOrder = coffeeOrderSort[randomNum(coffeeOrderSort)];
    coffeeQueue.push(newOrder);

    // order table에 새 order 표시
    let newOrderP = document.createElement("p");
    let newOrderPTxt = document.createTextNode(`주문 : ${newOrder['menu']} - ${newOrder['amount']}`);
    newOrderP.appendChild(newOrderPTxt);
    orderTable.appendChild(newOrderP);

    makeCoffee();
});

// 매상
let income = 0;
let displayIncome = document.querySelector('.income');


// 커피 제조 함수
function makeCoffee() {

    partTimers.forEach((item, idx) => {
        console.log(1)
        // 알바가 일하지 않고있고 커피 주문이 1개 이상 존재할때
        if(item['status'] == '쉬고 있음' && coffeeQueue.length > 0){

            // 알바 상태 변경
            item['status'] = '일하는 중';
            /*
            let nowPartTimer = partTimerWrap.children[idx];
            // let nowPartTimerMode = nowPartTimer.getElementsByClassName('parttimer-mode'); // 안됨. HTMLCollection 반환
            let nowPartTimerMode = nowPartTimer.children[1];
            nowPartTimerMode.innerText = item['status'];
            */
            makePartTimer();

            async function finishMakeCoffee() {

                // 주문 정보
                let order = coffeeQueue[0];
                let menuName = order['menu'];
                let menuAmount = order['amount'];
                let makingTime = item['workingTime'] * order['makingTime'];
                let price = order['price'];

                coffeeQueue.shift();
                
                // 만드는 시간동안 대기
                await new Promise((resolve, reject) => setTimeout(resolve, makingTime));

                item['status'] = '쉬고 있음';
                // nowPartTimerMode.innerText = item['status'];
                makePartTimer();
                income += price;
                displayIncome.innerText = income;

                let newOrderP = document.createElement("p");
                let newOrderPTxt = document.createTextNode(`알바 ${idx+1} : ${menuName} - ${menuAmount} 제조 완료되었습니다.`);
                newOrderP.appendChild(newOrderPTxt);
                orderTable.appendChild(newOrderP);
            }

            finishMakeCoffee();
        }
    });
}

setInterval(() => {
    if(coffeeQueue.length > 0){
        switch(partTimers.length){
            case 0:
                let alertP = document.createElement("p");
                let alertPTxt = document.createTextNode("커피를 제조할 알바가 없습니다. 조금만 기다려주세요.");
                alertP.appendChild(alertPTxt);
                orderTable.appendChild(alertP);
                break;

            default :
                makeCoffee();
        }
    }
}, 3000);


<script lang="ts">
    import { got } from "utils/helpers";
    import { popup } from "utils/popup";

    const test = async () => {
        // popup("테스트", 1)
        // popup("정말 삭제하시겠습니까?", 3, (data)=>{console.log(data)});

        const socket = new WebSocket('wss://ws.blockchain.info/inv');
        const WHALE_THRESHOLD_BTC = 500;

        socket.onopen = () => {
        console.log('✅ WebSocket 연결됨');
        socket.send(JSON.stringify({ op: 'unconfirmed_sub' }));
        };

        socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.op === 'utx') {
            const tx = data.x;
            const outputs = tx.out;
            const totalSatoshi = outputs.reduce((acc, out) => acc + out.value, 0);
            const totalBTC = totalSatoshi / 100_000_000;

            if (totalBTC >= WHALE_THRESHOLD_BTC) {
                const message = `🐋 Whale Alert! TX Hash: ${tx.hash}<br>💰 Amount: ${totalBTC.toFixed(4)} BTC<br><br>`;
                document.getElementById("log").innerHTML += message;
            }
            }
        } catch (e) {
            console.error("❌ 파싱 에러:", e);
        }
        };

        socket.onerror = (err) => {
            console.error('🚨 WebSocket 에러:', err);
        };

        socket.onclose = () => {
            console.log('🔌 연결 종료됨');
        };

    }

</script>
    <button on:click={test}>테스트</button>
<style lang="scss">
</style>

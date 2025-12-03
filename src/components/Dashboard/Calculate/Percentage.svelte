<script lang="ts">
    let amountA: number | string = null;
    let amountB: number | string = null;
    let percentage: string | number = 0;

    // 숫자에 콤마 추가하는 함수 (소수점 2자리까지만)
    const formatNumberWithCommas = (value: number | string): string => {
        if (!value || value === '' || value === null) return '';
        
        // 문자열인 경우 콤마 제거 후 숫자로 변환
        const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
        if (isNaN(num) || num === 0) return '0';
        
        // 소수점 부분이 있는지 확인
        const hasDecimals = num % 1 !== 0;
        
        return num.toLocaleString('ko-KR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: hasDecimals ? 2 : 0
        });
    };

    // 콤마가 포함된 문자열에서 숫자만 추출하는 함수
    const parseFormattedNumber = (value: string): number => {
        if (!value || value === '') return 0;
        return parseFloat(value.replace(/,/g, '')) || 0;
    };

    // 소수점 2자리로 제한하는 함수
    const limitDecimalPlaces = (value: string, maxDecimals: number = 2): string => {
        if (!value || value === '-') return value;
        
        const parts = value.split('.');
        if (parts.length > 1) {
            parts[1] = parts[1].substring(0, maxDecimals);
            return parts.join('.');
        }
        return value;
    };

    // 공통 금액 입력 핸들러
    const handleAmountInput = (e: Event, field: 'amountA' | 'amountB') => {
        const target = e.target as HTMLInputElement;
        let value = target.value.replace(/[^0-9.]/g, '');
        
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        value = limitDecimalPlaces(value, 2);
        
        if (value === '' || value === '.') {
            if (field === 'amountA') {
                amountA = value;
            } else {
                amountB = value;
            }
            calculatePercentage();
            return;
        }
        
        // 소수점으로 끝나는 경우 처리
        if (value.endsWith('.')) {
            if (field === 'amountA') {
                amountA = value;
            } else {
                amountB = value;
            }
            calculatePercentage();
            return;
        }
        
        const numericValue = parseFormattedNumber(value);
        const formattedValue = formatNumberWithCommas(numericValue);
        
        if (field === 'amountA') {
            amountA = formattedValue;
        } else {
            amountB = formattedValue;
        }
        
        calculatePercentage();
    };


    const calculatePercentage = () => {
        const numA = parseFormattedNumber(amountA?.toString() || '0');
        const numB = parseFormattedNumber(amountB?.toString() || '0');
        
        if(numA && numB && numA !== 0) {
            const result = ((numB - numA) / numA) * 100;
            if(result % 1 !== 0) {
                percentage = result.toFixed(2);
            } else {
                percentage = result.toString();
            }
        } else {
            percentage = '0';
        }
    };

    const resetCalculator = () => {
        amountA = '';
        amountB = '';
        percentage = '0';
    };

</script>

<section class="calculate">
    <div class="calculate__header">
        <h3>📊 변동률 계산기</h3>

        <div class="calculate__header__action">
            <button class="calculate__header__action__btn" on:click={resetCalculator}>
                초기화
            </button>
        </div>
    </div>
    <div class="calculate__content">
        <div class="calculate__content__input">
            <div class="calculate__content__input__row">
                <div class="calculate__content__input__group">
                    <label for="amountA">A 금액 (현재가)</label>
                    <input 
                        id="amountA"
                        type="text" 
                        bind:value={amountA}
                        placeholder="원금을 입력하세요"
                        on:input={(e) => handleAmountInput(e, 'amountA')}
                    />
                </div>
                <div class="calculate__content__input__group">
                    <label for="amountB">B 금액 (목표가)</label>
                    <input 
                        id="amountB"
                        type="text" 
                        bind:value={amountB}
                        placeholder="현재가를 입력하세요"
                        on:input={(e) => handleAmountInput(e, 'amountB')}
                    />
                </div>
                <div class="calculate__content__input__group">
                    <label for="percentage">변동률(%)</label>
                    <input 
                        id="percentage"
                        class:positive={Number(percentage) > 0} class:negative={Number(percentage) < 0}
                        type="text" 
                        bind:value={percentage}
                        readonly
                    />
                </div>
            </div>
        </div>
    </div>
</section>

<style lang="scss">
    @use "../Calculate.scss";
</style>
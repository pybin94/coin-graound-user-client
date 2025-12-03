<script lang="ts">
    // 물타기 계산기 변수
    let initialPrice: number | string = '';
    let initialQuantity: number | string = '';
    let initialAmount: number | string = '';
    let newPrice: number | string = '';
    let newQuantity: number | string = '';
    let newAmount: number | string = '';
    let averagePrice: number | string = 0;
    let totalQuantity: number | string = 0;
    let totalInvestment: number | string = 0;
    let isAveragingCalculated: boolean = false;

    // 숫자에 콤마 추가하는 함수 (소수점 3자리까지만)
    const formatNumberWithCommas = (value: number | string): string => {
        if (!value || value === '' || value === null) return '';
        
        // 문자열인 경우 콤마 제거 후 숫자로 변환
        const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
        if (isNaN(num) || num === 0) return '0';
        
        // 소수점 부분이 있는지 확인
        const hasDecimals = num % 1 !== 0;
        
        return num.toLocaleString('ko-KR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: hasDecimals ? 3 : 0
        });
    };

    // 콤마가 포함된 문자열에서 숫자만 추출하는 함수
    const parseFormattedNumber = (value: string): number => {
        if (!value || value === '') return 0;
        return parseFloat(value.replace(/,/g, '')) || 0;
    };

    // 소수점 3자리로 제한하는 함수
    const limitDecimalPlaces = (value: string, maxDecimals: number = 3): string => {
        if (!value || value === '-') return value;
        const parts = value.split('.');
        if (parts.length > 1) {
            parts[1] = parts[1].substring(0, maxDecimals);
            return parts.join('.');
        }
        return value;
    };

    // 공통 입력 핸들러
    const handleAmountInput = (e: Event, field: 'initialPrice' | 'initialQuantity' | 'newPrice' | 'newQuantity') => {
        const target = e.target as HTMLInputElement;
        let value = target.value.replace(/[^0-9.]/g, '');
        
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        value = limitDecimalPlaces(value, 3);
        
        if (value === '' || value === '.') {
            if (field === 'initialPrice') {
                initialPrice = value;
            } else if (field === 'initialQuantity') {
                initialQuantity = value;
            } else if (field === 'newPrice') {
                newPrice = value;
            } else {
                newQuantity = value;
            }
            calculateAveraging();
            return;
        }
        
        if (value.endsWith('.')) {
            if (field === 'initialPrice') {
                initialPrice = value;
            } else if (field === 'initialQuantity') {
                initialQuantity = value;
            } else if (field === 'newPrice') {
                newPrice = value;
            } else {
                newQuantity = value;
            }
            calculateAveraging();
            return;
        }
        
        const numericValue = parseFormattedNumber(value);
        const formattedValue = formatNumberWithCommas(numericValue);
        
        if (field === 'initialPrice') {
            initialPrice = formattedValue;
        } else if (field === 'initialQuantity') {
            initialQuantity = formattedValue;
        } else if (field === 'newPrice') {
            newPrice = formattedValue;
        } else {
            newQuantity = formattedValue;
        }
        
        calculateAveraging();
    };

    // 물타기 계산기 함수들
    const calculateAveraging = () => {
        const numInitialPrice = parseFormattedNumber(initialPrice?.toString() || '0');
        const numInitialQuantity = parseFormattedNumber(initialQuantity?.toString() || '0');
        const numNewPrice = parseFormattedNumber(newPrice?.toString() || '0');
        const numNewQuantity = parseFormattedNumber(newQuantity?.toString() || '0');
        
        // 보유 금액 계산
        const calculatedInitialAmount = numInitialPrice * numInitialQuantity;
        initialAmount = formatNumberWithCommas(calculatedInitialAmount);
        
        // 추가매수 금액 계산
        const calculatedNewAmount = numNewPrice * numNewQuantity;
        newAmount = formatNumberWithCommas(calculatedNewAmount);
        
        // 최종 계산
        if (numInitialPrice > 0 && numInitialQuantity > 0 && numNewPrice > 0 && numNewQuantity > 0) {
            const calculatedTotalQuantity = numInitialQuantity + numNewQuantity;
            const calculatedTotalInvestment = calculatedInitialAmount + calculatedNewAmount;
            const calculatedAveragePrice = calculatedTotalInvestment / calculatedTotalQuantity;
            
            totalQuantity = formatNumberWithCommas(calculatedTotalQuantity);
            totalInvestment = formatNumberWithCommas(calculatedTotalInvestment);
            averagePrice = formatNumberWithCommas(calculatedAveragePrice);
            isAveragingCalculated = true;
        } else {
            totalQuantity = '0';
            totalInvestment = '0';
            averagePrice = '0';
            isAveragingCalculated = false;
        }
    };

    const resetCalculator = () => {
        initialPrice = '';
        initialQuantity = '';
        initialAmount = '';
        newPrice = '';
        newQuantity = '';
        newAmount = '';
        averagePrice = 0;
        totalQuantity = 0;
        totalInvestment = 0;
        isAveragingCalculated = false;
    };

</script>

<div class="calculate">
    <div class="calculate__header">
        <h4>💰 물타기 계산기</h4>
        <div class="calculate__header__action">
            <button class="calculate__header__action__btn" on:click={resetCalculator}>
                초기화
            </button>
        </div>
    </div>
    
    <div class="calculate__content">
        <div class="calculate__content__input">
            <div class="calculate__content__input__row">
                <div class="calculate__content__input__group calculate-padding">
                    <label for="initialPrice">보유 평단가</label>
                    <input 
                        id="initialPrice"
                        type="text" 
                        bind:value={initialPrice}
                        placeholder="보유 평단가"
                        on:input={(e) => handleAmountInput(e, 'initialPrice')}
                    />
                </div>
                
                <div class="calculate__content__input__group">
                    <label for="initialQuantity">보유 수량</label>
                    <input 
                        id="initialQuantity"
                        type="text" 
                        bind:value={initialQuantity}
                        placeholder="보유 수량"
                        on:input={(e) => handleAmountInput(e, 'initialQuantity')}
                    />
                </div>
                
                <div class="calculate__content__input__group">
                    <label for="initialAmount">금액</label>
                    <input 
                        id="initialAmount"
                        type="text" 
                        bind:value={initialAmount}
                        placeholder="금액"
                        readonly
                    />
                </div>
            </div>
            
            <div class="calculate__content__input__row calculate-padding">
                <div class="calculate__content__input__group">
                    <label for="newPrice">추가매수 평단가</label>
                    <input 
                        id="newPrice"
                        type="text" 
                        bind:value={newPrice}
                        placeholder="추가매수 평단가"
                        on:input={(e) => handleAmountInput(e, 'newPrice')}
                    />
                </div>
                
                <div class="calculate__content__input__group">
                    <label for="newQuantity">추가매수 수량</label>
                    <input 
                        id="newQuantity"
                        type="text" 
                        bind:value={newQuantity}
                        placeholder="추가매수 수량"
                        on:input={(e) => handleAmountInput(e, 'newQuantity')}
                    />
                </div>
                
                <div class="calculate__content__input__group">
                    <label for="newAmount">금액</label>
                    <input 
                        id="newAmount"
                        type="text" 
                        bind:value={newAmount}
                        placeholder="금액"
                        readonly
                    />
                </div>
            </div>
            <div class="calculate__content__input__row">
                <div class="calculate__content__input__group">
                    <label for="averagePrice">최종 평단가</label>
                    <input 
                        id="averagePrice"
                        type="text" 
                        bind:value={averagePrice}
                        readonly
                    />
                </div>
                
                <div class="calculate__content__input__group">
                    <label for="totalQuantity">최종 수량</label>
                    <input 
                        id="totalQuantity"
                        type="text" 
                        bind:value={totalQuantity}
                        readonly
                    />
                </div>
                
                <div class="calculate__content__input__group">
                    <label for="totalInvestment">최종 금액</label>
                    <input 
                        id="totalInvestment"
                        type="text" 
                        bind:value={totalInvestment}
                        readonly
                    />
                </div>
            </div>
        </div>
    </div>
</div>


<style lang="scss">
    @import "../Calculate.scss";

    .calculate-padding {
        padding-bottom: calc(var(--distance) / 2);
    }
</style>
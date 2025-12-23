<script lang="ts">
    let baseAmount: number | string = null;
    let retrunPercentageValue: number | string = null;
    let resultAmount: string | number = 0;
    let isPercentageCalculated: boolean = false;

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

    // 공통 입력 핸들러
    const handleAmountInput = (e: Event, field: 'baseAmount' | 'retrunPercentageValue') => {
        const target = e.target as HTMLInputElement;
        let value = target.value.replace(/[^0-9.]/g, '');
        
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        value = limitDecimalPlaces(value, 2);
        
        if (value === '' || value === '.') {
            if (field === 'baseAmount') {
                baseAmount = value;
            } else {
                retrunPercentageValue = value;
            }
            calculatePercentageResult();
            return;
        }
        
        if (value.endsWith('.')) {
            if (field === 'baseAmount') {
                baseAmount = value;
            } else {
                retrunPercentageValue = value;
            }
            calculatePercentageResult();
            return;
        }
        
        const numericValue = parseFormattedNumber(value);
        const formattedValue = formatNumberWithCommas(numericValue);
        
        if (field === 'baseAmount') {
            baseAmount = formattedValue;
        } else {
            retrunPercentageValue = formattedValue;
        }
        
        calculatePercentageResult();
    };

    const calculatePercentageResult = () => {
        const numBaseAmount = parseFormattedNumber(baseAmount?.toString() || '0');
        const numPercentageValue = parseFormattedNumber(retrunPercentageValue?.toString() || '0');
        
        if (numBaseAmount > 0 && numPercentageValue >= 0) {
            const result = numBaseAmount + (numBaseAmount * numPercentageValue) / 100;
            resultAmount = formatNumberWithCommas(result);
            isPercentageCalculated = true;
        } else {
            resultAmount = '0';
            isPercentageCalculated = false;
        }
    };

    const resetCalculator = () => {
        baseAmount = '';
        retrunPercentageValue = '';
        resultAmount = '0';
        isPercentageCalculated = false;
    };

</script>

<div class="calculate">
    <div class="calculate__header">
        <h4>📈 수익률 계산기</h4>
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
                    <label for="baseAmount">금액</label>
                    <input 
                        id="baseAmount"
                        type="text" 
                        bind:value={baseAmount}
                        placeholder="기본 금액"
                        on:input={(e) => handleAmountInput(e, 'baseAmount')}
                    />
                </div>
                
                <div class="calculate__content__input__group">
                    <label for="returnPercentage">상승률 (%)</label>
                    <input 
                        id="returnPercentage"
                        type="text" 
                        bind:value={retrunPercentageValue}
                        placeholder="상승률"
                        on:input={(e) => handleAmountInput(e, 'retrunPercentageValue')}
                    />
                </div>
                
                <div class="calculate__content__input__group">
                    <label for="resultAmount">결과 금액</label>
                    <input 
                        id="resultAmount"
                        type="text" 
                        class:positive={parseFormattedNumber(resultAmount?.toString() || '0') > 0}
                        bind:value={resultAmount}
                        placeholder="결과 금액"
                        readonly
                    />
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @use "../Calculate.scss";
</style>
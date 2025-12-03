/** Usage
 * <input 
 *    on:keydown={(e)=>{handleValidate(e)}}
 *    on:blur={(e)=>{handleValidate(e)}}
 * >
 */

export const handleValidate = function (event: any, validate: boolean = true): void {
    if(validate == false) {
        event.currentTarget.classList.add("invalid")
    } else {
        event.currentTarget.value
        ? event.currentTarget.classList.remove("invalid")
        : event.currentTarget.classList.add("invalid");
    }
}
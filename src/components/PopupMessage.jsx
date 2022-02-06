export default function  PopupMessage(props) {
    const popupVisible = props.isOpened ? 'popup-message popup-message_visible' : 'popup-message'

    function a () {
        setTimeout(() => {
            return ''
        }, 10000)
    }

    return (
        <div className={popupVisible}>
            <div className='popup-message__container'>
            <button onClick={props.onClose} className="popup__close-btn popup__close-btn_message"></button>
                <p className="popup_message__text"> {props.isOpened ? props.text : a()}</p>
            </div>
        </div>
    )
}
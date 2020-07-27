import React, {useEffect, useState, useContext, useRef} from 'react';
import './BicyclesOption.scss';
import ObjectComponent from "./ObjectComponent";


const BicyclesOption = props => {
    const importerInput = useRef(null)
    const [state, setState] = useState({
        frameColor: 'blue',
        handlerColor: 'blue',
        gender: 'male',
        size: '26',
        saddleColor: 'black'
    })

    const onChangeHandler = (e) => {
        setState({
                ...state,
                [e.target.name]: e.target.value
            }
        )
    }

    const onExportHandler = () => {
        const fileName = 'export.json'
        const contentType = 'application/json;charset=utf-8;'
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            let blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(state)))], {type: contentType});
            navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            let a = document.createElement('a');
            a.download = fileName;
            a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(state));
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    const onImportBtnClickHandler = () => {
        importerInput.current.click()
    }

    const onImportHandler = e =>{
        const reader = new FileReader()
        reader.readAsText(e.target.files[0])
        reader.onload = e => {
            setState({...state,  ...JSON.parse(e.target.result)})
        }
    }

    return (
        <div id='bicycles-option'>
            <div className="select-item">
                <div className="select-item-section">
                    <p>Frame Color:</p>
                    <select name='frameColor' value={state.frameColor} onChange={e => onChangeHandler(e)}>
                        <option value='red'>Red</option>
                        <option value='black'>Black</option>
                        <option value='blue'>Blue</option>
                        <option value='green'>Green</option>
                    </select>
                </div>
                <div className="select-item-section">
                    <p>Handler Color:</p>
                    <select name='handlerColor' value={state.handlerColor} onChange={e => onChangeHandler(e)}>
                        <option value='red'>Red</option>
                        <option value='black'>Black</option>
                        <option value='blue'>Blue</option>
                        <option value='green'>Green</option>
                    </select>
                </div>
                <div className="select-item-section">
                    <p>Saddle Color:</p>
                    <select name='saddleColor' value={state.saddleColor} onChange={e => onChangeHandler(e)}>
                        <option value='red'>Red</option>
                        <option value='black'>Black</option>
                        <option value='blue'>Blue</option>
                        <option value='green'>Green</option>
                    </select>
                </div>
                <div className="select-item-section">
                    <p>Gender:</p>
                    <select name='gender' value={state.gender} onChange={e => onChangeHandler(e)}>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                    </select>
                </div>
                <div className="select-item-section">
                    <p>Size:</p>
                    <select name='size' value={state.size} onChange={e => onChangeHandler(e)}>
                        <option value={16}>16</option>
                        <option value={18}>18</option>
                        <option value={20}>20</option>
                        <option value={24}>24</option>
                    </select>
                </div>
            </div>
            <div>
                <input ref={importerInput} type='file' style={{display: 'none'}} onChange={e=>onImportHandler(e)}/>
                <button onClick={() => onImportBtnClickHandler()}>Import</button>
                <button onClick={() => onExportHandler()}>Export</button>
            </div>
            <ObjectComponent {...state}/>
        </div>
    );
};
export default BicyclesOption;


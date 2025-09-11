import loadingTicker from '../../assets/loading_light.gif';

export default function Loading() {
    return (
        <img 
            src={loadingTicker} 
            style={{width: '150px', imageRendering: 'pixelated'}} 
        />
    );
}


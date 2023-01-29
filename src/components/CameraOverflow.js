import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import Svg, { Defs, Rect, Mask, Ellipse } from 'react-native-svg';

const CameraOverlay = ({conditions}) => {
    const { height, width } = Dimensions.get('window');
    const xRadius = width / 3;
    const yRadius = width / 2.3;
    const viewBox = `0 0 ${width} ${height}`
    return (
        <View aspectRatio={1} style={{ opacity: 0.5 }}>
            <Svg
                height={height}
                viewBox={viewBox}
            >
                <Defs>
                    <Mask id="mask">
                        <Rect height={height} width={width} fill="#fff" />

                        {conditions === 'tela2' ? <Ellipse
                            cx={width / 2}
                            cy={height / 2}
                            rx={xRadius}
                            ry={yRadius}
                            stroke="red"
                            strokeWidth="4"
                            fill="#000"
                        />: null}
                       {conditions ==='tela3' ? <Rect
                            x={width/1000}
                            y={height/3}
                            width={width}
                            height={height/3}
                            fill="#000"
                            strokeWidth="3"
                            stroke="rgb(0,0,0)"
                        />: null}
                    </Mask>
                </Defs>

                <Rect
                    height={height}
                    width={width}
                    fill="#ffffff"
                    mask="url(#mask)"
                />
            </Svg>
        </View>
    );
};

export default CameraOverlay;
import React from 'react';
import { CirclePicker } from 'react-color';

let colors = [
    "#FFFECA",
    "#B32F23",
    "#3477D2",
    "#E6DAC8",
    "#3D5320",
    "#4A8037",
    "#C77D56",
    "#D562B7",
    "#643779",
    "#B272CE",
    "#2C4466",
    "#6FC5A8",
];

// let colors = [
//     { r: '255', g: '254', b: '202' }
// ]
// { r: 179, g: 47, b: 35 },
// { r: 52, g: 119, b: 210 },
// { r: 230, g: 218, b: 200 },
// { r: 61, g: 83, b: 32 },
// { r: 74, g: 128, b: 55 },
// { r: 199, g: 125, b: 86 },
// { r: 213, g: 98, b: 183 },
// { r: 100, g: 55, b: 121 },
// { r: 178, g: 114, b: 206 },
// { r: 44, g: 68, b: 102 },
// { r: 111, g: 197, b: 168 },
// ;

// let colors = [
//     {r: 255, g: 254, b: 202},
//     "{ r: 179, g: 47, b: 35 }",
//     "{ r: 52, g: 119, b: 210 }",
//     "{ r: 230, g: 218, b: 200 }",
//     "{ r: 61, g: 83, b: 32 }",
//     "{ r: 74, g: 128, b: 55 }",
//     "{ r: 199, g: 125, b: 86 }",
//     "{ r: 213, g: 98, b: 183 }",
//     "{ r: 100, g: 55, b: 121 }",
//     "{ r: 178, g: 114, b: 206 }",
//     "{ r: 44, g: 68, b: 102 }",
//     "{ r: 111, g: 197, b: 168 }",
// ];

var style1 = {
    // display: 'flex',
    // justifyContent: 'center',
    backgroundColor: "rgba( 255, 255, 255, 0.5)",
    padding: "20px",
    // marginLeft: '30px',
    // marginRight: '50px',
    // marginTop: '10px',
    // marginBottom: '25px',
    borderRadius: '25px',
    // margin: '0 auto',
    width: "308px"
}

export default function Palette(props) {
    const [color, setColor] = React.useState("#FFFFFF");

    // const recordColor = (color) => {
    //     console.log(color.hex);
    //     props.selectColor(color.hex);
    // }

    const changeColor = (color) => {
        props.selectColor(color.hex);
        setColor(color.hex);
        console.log(color);
        props.paint();
        console.log('paintingmode')
    }

    return (
        <div>
            <div style={style1}>
                <CirclePicker
                    width="330px"
                    colors={colors}
                    color={color}
                    circleSize={28}
                    circleSpacing={20}
                    // onClick={changeColor}
                    // onSwatchHover={recordColor}
                    onChangeComplete={changeColor}
                />

            </div>
        </div>
    );
}

import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ScatterPlot from './ScatterPlot';
import * as d3 from 'd3';
// import legend   from 'd3-svg-legend/no-extend';


const ScatterplotMatrix = props => {
    const {
        data
    } = props;
    const [isLoading, setIsLoading] = useState(true)
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const [data5, setData5] = useState([]);
    const [data6, setData6] = useState([]);
    const [data7, setData7] = useState([]);
    const [data8, setData8] = useState([]);
    const [data9, setData9] = useState([]);
    //player_dist_walk,player_dmg, player_survive_time
    const processData = (data) => {
        var temp1 = [], temp2 = [], temp3 = [], temp4 = [], temp5 = [], temp6 = [], temp7 = [], temp8 = [], temp9 = [];
        for (var i = 0; i < data.length; i++) {
            var arr1 = [
                data[i].player_dist_walk,
                data[i].player_dist_walk,
            ]
            var arr2 = [
                data[i].player_dist_walk,
                data[i].player_dmg,
            ]
            var arr3 = [
                data[i].player_dist_walk,
                data[i].player_survive_time,
            ]
            var arr4 = [
                data[i].player_dmg,
                data[i].player_dist_walk,
            ]
            var arr5 = [
                data[i].player_dmg,
                data[i].player_dmg,
            ]
            var arr6 = [
                data[i].player_dmg,
                data[i].player_survive_time,
            ]
            var arr7 = [
                data[i].player_survive_time,
                data[i].player_dist_walk,
            ]
            var arr8 = [
                data[i].player_survive_time,
                data[i].player_dmg,
            ]
            var arr9 = [
                data[i].player_survive_time,
                data[i].player_survive_time,
            ]
            temp1.push(arr1);
            temp2.push(arr2);
            temp3.push(arr3);
            temp4.push(arr4);
            temp5.push(arr5);
            temp6.push(arr6);
            temp7.push(arr7);
            temp8.push(arr8);
            temp9.push(arr9);
        }
        setData1(temp1);
        setData2(temp2);
        setData3(temp3);
        setData4(temp4);
        setData5(temp5);
        setData6(temp6);
        setData7(temp7);
        setData8(temp8);
        setData9(temp9);
    };

    useEffect(() => {
        if (isLoading) {
            processData(data)
            setIsLoading(false);
        }
        console.log("matrix loading")
    });

    return (
        isLoading ? "LOADING"
            : (
                <div>
                    <div style={styles.row}>
                        <ScatterPlot
                            data={
                                data1
                            }
                            title={"Distance Traveled"}
                        />
                        <ScatterPlot
                            data={
                                data2
                            }
                        />
                        <ScatterPlot
                            data={
                                data3
                            }
                        />
                    </div>
                    <div style={styles.row}>
                        <ScatterPlot
                            data={
                                data4
                            }
                        />
                        <ScatterPlot
                            data={
                                data5
                            }
                            title={"Player Damage"}
                        />
                        <ScatterPlot
                            data={
                                data6
                            }
                        />
                    </div>
                    <div style={styles.row}>
                        <ScatterPlot
                            data={
                                data7
                            }
                        />
                        <ScatterPlot
                            data={
                                data8
                            }
                        />
                        <ScatterPlot
                            data={
                                data9
                            }
                            title={"Survival Time"}
                        />
                    </div>
                </div>
            )
    );

};

const styles = {
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end'
    }
}
export default ScatterplotMatrix;
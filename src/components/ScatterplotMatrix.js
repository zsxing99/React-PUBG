import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ScatterPlot from './ScatterPlot';
import { Select } from 'antd';
import * as d3 from 'd3';
const { Option } = Select;


const SelectionMenu = props => {
    // default: dist_walk , player dmg, survival time, 4, 5, 7

    const [allOptions, setAllOptions] = useState([
        "player_dist_ride",
        "player_dist_walk", "player_dmg", "player_kills",
        "player_survive_time", "team_placement"
    ]);

    //game_size party_size player_assists player_dist_ride,
    //player_dist_walk,player_dmg,player_kills,player_survive_time,team_placement
    return (
        <div styles={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-even' }}>
            <Select defaultValue={allOptions[1]} style={{ width: 200 }} onChange={props.handleChange1}>
                <Option value={allOptions[0]}>Player Distance Ride</Option>
                <Option value={allOptions[1]}>Player Distance Walk</Option>
                <Option value={allOptions[2]}>Player Damage</Option>
                <Option value={allOptions[3]}>Player Survive Time</Option>
                <Option value={allOptions[4]}>Team Placement</Option>
            </Select>
            <Select defaultValue={allOptions[2]} style={{ width: 200 }} onChange={props.handleChange2}>
                <Option value={allOptions[0]}>Player Distance Ride</Option>
                <Option value={allOptions[1]}>Player Distance Walk</Option>
                <Option value={allOptions[2]}>Player Damage</Option>
                <Option value={allOptions[3]}>Player Survive Time</Option>
                <Option value={allOptions[4]}>Team Placement</Option>
            </Select>
            <Select defaultValue={allOptions[3]} style={{ width: 200 }} onChange={props.handleChange3}>
                <Option value={allOptions[0]}>Player Distance Ride</Option>
                <Option value={allOptions[1]}>Player Distance Walk</Option>
                <Option value={allOptions[2]}>Player Damage</Option>
                <Option value={allOptions[3]}>Player Survive Time</Option>
                <Option value={allOptions[4]}>Team Placement</Option>
            </Select>
        </div>
    )

}

const ScatterplotMatrix = props => {
    const {
        data
    } = props;
    const [firstSelectedCategory, setFirstSelectedCategory] = useState("player_dist_walk");
    const [secondSelectedCategory, setSecondSelectedCategory] = useState("player_dmg");
    const [thirdSelectedCategory, setThirdSelectedCategory] = useState("player_survive_time");
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

    const handleChange1 = (selectedItem) => {
        setFirstSelectedCategory(selectedItem)
    };
    const handleChange2 = (selectedItem) => {
        setSecondSelectedCategory(selectedItem)
    };
    const handleChange3 = (selectedItem) => {
        setThirdSelectedCategory(selectedItem)
    };

    //player_dist_walk,player_dmg, player_survive_time
    const processData = (data) => {
        var temp1 = [], temp2 = [], temp3 = [], temp4 = [], temp5 = [], temp6 = [], temp7 = [], temp8 = [], temp9 = [];
        for (var i = 0; i < data.length; i++) {
            var arr1 = [
                data[i][firstSelectedCategory],
                data[i][firstSelectedCategory],
            ]
            var arr2 = [
                data[i][firstSelectedCategory],
                data[i][secondSelectedCategory],
            ]
            var arr3 = [
                data[i][firstSelectedCategory],
                data[i][thirdSelectedCategory],
            ]
            var arr4 = [
                data[i][secondSelectedCategory],
                data[i][firstSelectedCategory],
            ]
            var arr5 = [
                data[i][secondSelectedCategory],
                data[i][secondSelectedCategory],
            ]
            var arr6 = [
                data[i][secondSelectedCategory],
                data[i][thirdSelectedCategory],
            ]
            var arr7 = [
                data[i][thirdSelectedCategory],
                data[i][firstSelectedCategory],
            ]
            var arr8 = [
                data[i][thirdSelectedCategory],
                data[i][secondSelectedCategory],
            ]
            var arr9 = [
                data[i][thirdSelectedCategory],
                data[i][thirdSelectedCategory],
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
    }, []);

    useEffect(() => {
        processData(data)
    }, [firstSelectedCategory, secondSelectedCategory, thirdSelectedCategory])

    return (
        isLoading ? "LOADING"
            : (
                <div>
                    <div>
                        <SelectionMenu
                            handleChange1={handleChange1}
                            handleChange2={handleChange2}
                            handleChange3={handleChange3}
                        />
                    </div>
                    <div style={styles.row}>
                        <ScatterPlot
                            data={
                                data1
                            }
                            title={firstSelectedCategory}
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
                            title={secondSelectedCategory}
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
                            title={thirdSelectedCategory}
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
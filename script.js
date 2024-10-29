const { useState, useRef, useEffect } = React;
const keys = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];
const presets = {
  default: [
  { name: "Closed HH", id: 802 },
  { name: "Open HH", id: 104228 },
  { name: "Crash", id: 11391 },
  { name: "Snare", id: 13750 },
  { name: "Tom", id: 449 },
  { name: "Drumsticks", id: 270091 },
  { name: "Kick", id: 47951 },
  { name: "Ride 1", id: 13250 },
  { name: "Ride 2", id: 16278 }],

  electronic: [
  { name: "Closed HH", id: 513362 },
  { name: "Open HH", id: 513383 },
  { name: "Crash", id: 615359 },
  { name: "Snare", id: 103365 },
  { name: "Kick", id: 342015 },
  { name: "Clap", id: 244568 },
  { name: "Tom 1", id: 108001 },
  { name: "Tom 2", id: 709718 },
  { name: "Tom 3", id: 697201 }] };



const DrumMachine = () => {
  const [isDefaultMode, setIsDefaultMode] = useState(true);
  const [defaultArr, setDefaultArr] = useState([]);
  const [electronicArr, setElectronicArr] = useState([]);
  const [currArr, setCurrArr] = useState([]);
  const [isOn, setIsOn] = useState(true);
  const [display, setDisplay] = useState("Loading audio");
  const [volume, setVolume] = useState(75);
  const [isLabelVisible, setIsLabelVisible] = useState(false);

  const getSound = async id => {
    try {
      const response = await fetch(
      `https://freesound.org/apiv2/sounds/${id}/`,
      {
        method: "GET",
        headers: { Authorization: `Token ${API_KEY}` } });



      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return new Audio(data.previews["preview-hq-mp3"]);
    } catch (error) {
      console.error(error);
      setDisplay("Failed to load audio");
    }
  };

  const getPresetArr = async presetsArr => {
    const promises = presetsArr.map(async el => {
      const soundSample = await getSound(el.id);
      return { name: el.name, sound: soundSample };
    });
    return await Promise.all(promises);
  };

  const handlePowerChange = () => {
    setIsOn(prev => {
      const newVal = !prev;
      setDisplay(
      newVal ? isDefaultMode ? "Default Preset" : "Electronic Preset" : " ");

      return newVal;
    });
  };

  const handleButtonClick = index => {var _currArr$index, _currArr$index2;
    const sample = new Audio((_currArr$index = currArr[index]) === null || _currArr$index === void 0 ? void 0 : _currArr$index.sound.src);
    sample.volume = Math.pow(volume / 100, 2.5);
    sample.play();
    setDisplay((_currArr$index2 = currArr[index]) === null || _currArr$index2 === void 0 ? void 0 : _currArr$index2.name);
  };

  const handleKeyPress = event => {
    const keyIndex = keys.indexOf(event.key.toUpperCase());
    if (keyIndex !== -1) {
      const button = document.getElementById(`btn-id-${keyIndex}`);
      button.click();
      button.classList.add("fake-active");
      setTimeout(() => {
        button.classList.remove("fake-active");
      }, 50);
    }
  };

  const handlePresetChange = () => {
    setIsDefaultMode(prev => {
      const newVal = !prev;
      if (newVal) {
        setCurrArr(defaultArr);
        setDisplay("Default Preset");
      } else {
        setCurrArr(electronicArr);
        setDisplay("Electronic Preset");
      }
      return newVal;
    });
  };

  const handleVolumeChange = event => {
    setVolume(event.target.value);
  };

  const handleSliderMouseDown = () => {
    setIsLabelVisible(true);
  };

  const handleSliderMouseUp = () => {
    setIsLabelVisible(false);
  };

  useEffect(() => {
    const loadSounds = async () => {
      let arr = await getPresetArr(presets.default);
      setDefaultArr(arr);
      setCurrArr(arr);
      arr = await getPresetArr(presets.electronic);
      setElectronicArr(arr);
      setDisplay("Default Preset");
    };
    loadSounds();

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return /*#__PURE__*/(
    React.createElement("div", {
      id: "drum-machine",
      style: { borderRadius: "20px", width: "100%" },
      className: "p-4 container-fluid d-flex" }, /*#__PURE__*/

    React.createElement("div", { className: "row flex-grow-1 d-flex" }, /*#__PURE__*/
    React.createElement("div", { id: "buttons", className: "col-8" },
    keys.map((key, index) => {
      return /*#__PURE__*/(
        React.createElement("button", {
          className: "drum-pad btn",
          disabled: !isOn,
          onClick: () => handleButtonClick(index),
          key: `btn-${index}`,
          id: `btn-id-${index}` },

        key));


    })), /*#__PURE__*/

    React.createElement("div", {
      id: "settings",
      style: {
        justifyContent: "space-between",
        borderRadius: "20px" },

      className: "col-4 d-flex flex-column align-items-center bg-dark p-1 p-md-2" }, /*#__PURE__*/

    React.createElement("div", { className: "d-flex align-items-center fs-4" }, /*#__PURE__*/
    React.createElement("i", {
      style: { fontSize: "2rem", position: "relative", top: "3px" },
      className: "bi bi-power px-1" }), /*#__PURE__*/

    React.createElement("div", { className: "form-check form-switch" }, /*#__PURE__*/
    React.createElement("input", {
      className: "form-check-input",
      type: "checkbox",
      role: "switch",
      id: "power-switch",
      checked: isOn,
      onChange: handlePowerChange }))), /*#__PURE__*/



    React.createElement("div", {
      id: "display",
      style: {
        fontFamily: "'Seven Segment', sans-serif",
        backgroundColor: "rgb(20, 20, 20)",
        color: "lime",
        borderRadius: "10px" },

      className: "w-100 fs-4 text-center" },

    display), /*#__PURE__*/

    React.createElement("div", { className: "w-100" }, /*#__PURE__*/
    React.createElement("div", {
      style: { justifyContent: "space-between" },
      className: "w-100 d-flex" }, /*#__PURE__*/

    React.createElement("i", {
      style: {
        fontSize: "2rem",
        position: "relative",
        top: "2px" },

      className: "bi bi-volume-down px-2" }), /*#__PURE__*/

    React.createElement("div", {
      style: { position: "relative", right: "3px" },
      className: "flex-grow-1" }, /*#__PURE__*/

    React.createElement("input", {
      id: "volume-slider",
      style: { width: "100%", position: "relative", top: "15px" },
      type: "range",
      min: "0",
      max: "100",
      value: volume,
      onChange: handleVolumeChange,
      onMouseDown: handleSliderMouseDown,
      onMouseUp: handleSliderMouseUp }), /*#__PURE__*/

    React.createElement("div", {
      style: { width: "calc(100% - 17px)", height: "7px" },
      className: "mx-auto" }, /*#__PURE__*/

    React.createElement("div", {
      style: {
        left: `calc(${volume}% - 25px)`,
        display: `${isLabelVisible ? "block" : "none"}` },

      id: "volume-display" },

    volume, "%"))), /*#__PURE__*/



    React.createElement("i", {
      style: {
        fontSize: "2rem",
        position: "relative",
        top: "2px" },

      className: "bi bi-volume-up px-2" }))), /*#__PURE__*/



    React.createElement("div", {
      style: { position: "relative", bottom: "10px" },
      className: "d-flex align-items-center fs-4" }, /*#__PURE__*/

    React.createElement("i", {
      style: {
        fontSize: "1.5rem",
        position: "relative",
        top: "4px",
        right: "4px" },

      className: "bi bi-1-square px-2" }), /*#__PURE__*/

    React.createElement("div", { className: "form-check form-switch" }, /*#__PURE__*/
    React.createElement("input", {
      className: "form-check-input custom-switch",
      type: "checkbox",
      role: "switch",
      id: "preset-switch",
      checked: isDefaultMode,
      onChange: handlePresetChange })), /*#__PURE__*/


    React.createElement("i", {
      style: { fontSize: "1.5rem", position: "relative", top: "4px" },
      className: "bi bi-2-square" }))))));






};

ReactDOM.render( /*#__PURE__*/
React.createElement(DrumMachine, null),
document.getElementById("drum-machine-container"));
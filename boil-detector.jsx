const temperatureScales = {
  c : {
    name   : 'Celsius',
    symbol : '°C'
  },
  f : {
    name   : 'Farenheit',
    symbol : '°F'
  },
  k : {
    name   : 'Kelvin',
    symbol : 'K'
  }
};

var unitConversion = {
  from : {
    c : {
      to : {
        c : c => c,
        f : toFarenheit,
        k : c => c + 273
      }
    },
    f : {
      to : {
        f : f => f,
        c : toCelsius,
        k : f => toCelsius(f) + 273
      }
    },
    k : {
      to : {
        k : k => k,
        c : k => k - 273,
        f : k => toFarenheit(k - 273)
      }
    }
  }
}

function toCelsius(farenheit) {
  return (farenheit - 32) * 5 / 9;
}

function toFarenheit(celsius) {
  return (celsius / 5 * 9) + 32;
}

function tryConvert(value, convert) {
  const input = parseFloat(value);
  if (Number.isNaN(input)) {
    return '';
  }

  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;

  return rounded.toString();
}

function BoilVeredict(props) {
  if (props.celsius >= 100) {
    return <p className="alert alert-danger">The water is boiling</p>;
  }
  return <p className="alert alert-success">The water is not boiling</p>;
}

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value : ''
    };
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    const value = this.props.value;
    const scale = temperatureScales[this.props.scale];

    return (
      <form className="col form">
        <fieldset>
          <legend>{scale.name}</legend>
          <div className="form-group">
            <label className="sr-only">Temperature ({scale.symbol})</label>
            <input
              value={value}
              type="number"
              step="0.1"
              placeholder={scale.symbol}
              onChange={this.handleChange}
              className="form-control" />
          </div>
        </fieldset>
      </form>
    )
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.handleCelsiusChange = this.handleChange.bind(this, 'c');
    this.handleFahrenheitChange = this.handleChange.bind(this, 'f');
    this.handleKelvinChange = this.handleChange.bind(this, 'k');
    this.state = {
      value: '',
      scale: 'c'
    };
  }

  handleChange(scale, value) {
    this.setState({scale, value})
  }

  render() {
    const scale = this.state.scale;
    const value = this.state.value;
    const celsius = tryConvert(value, unitConversion.from[scale].to.c);
    const farenheit = tryConvert(value, unitConversion.from[scale].to.f);
    const kelvin = tryConvert(value, unitConversion.from[scale].to.k);

    return (
      <div className="container-fluid col-md-8 col-lg-6 col-xl-4">
        <div className="row">
          <TemperatureInput scale="c" value={celsius} onChange={this.handleCelsiusChange} />
          <TemperatureInput scale="f" value={farenheit} onChange={this.handleFahrenheitChange} />
          <TemperatureInput scale="k" value={kelvin} onChange={this.handleKelvinChange} />
        </div>
        <BoilVeredict celsius={celsius} />
      </div>
    )
  }
}


ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
)

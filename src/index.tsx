import * as React from 'react';
import { render } from 'react-dom';
import { TextInput, Textarea } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

interface AppProps {
  sdk: FieldExtensionSDK;
}

interface AppState {
  //value of text
  value: string;
  //value of TextArea
  jsonShowStr: string;
  //init value of contentful
  jsonInitStr:string;
}

export class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    var data = props.sdk.field.getValue();
    var jsonShowStr = '';
    var jsonInitStr='';
    //init data
    if (typeof (data) == "undefined") {
      data = [];
    } else {
      jsonShowStr = JSON.stringify(data,null,"\t");
      jsonInitStr=JSON.stringify(data,null,"\t");
    }
    this.state = {
      value: "",
      jsonShowStr: jsonShowStr,
      jsonInitStr:jsonInitStr
    };
  }

  detachExternalChangeHandler: Function | null = null;

  // componentDidMount() {
  //   this.props.sdk.window.startAutoResizer();

  //   // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
  //   this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  // }

  // componentWillUnmount() {
  //   if (this.detachExternalChangeHandler) {
  //     this.detachExternalChangeHandler();
  //   }
  // }

  // onExternalChange = (value: string) => {
  //   this.setState({ value });
  // };

  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    var value = e.currentTarget.value;
    var str = "";
    if (this.state.jsonInitStr=="") {
      var currencyEntity=new CurrencyEntity("CN",value);
      var currencyArr=[];
      currencyArr.push(currencyEntity);
      str = JSON.stringify(currencyArr,null,"\t");
    } else {
      var currencyEntity=new CurrencyEntity("CN",value);
      str =this.state.jsonInitStr.slice(0,this.state.jsonInitStr.length-1)+","+JSON.stringify(currencyEntity,null,"\t")+"\n]";
    } 
    this.setState({
      jsonShowStr: str
    });   
  };

  //onBlur save data
  onBlur = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if(this.state.jsonShowStr!=this.state.jsonInitStr){
         await this.props.sdk.field.setValue(JSON.parse(this.state.jsonShowStr));
         this.setState({jsonInitStr:this.state.jsonShowStr});
      }
  };



  render = () => {
    return (
      <div>
        <TextInput
          width="large"
          type="text"
          id="my-field"
          testId="my-field"
          value={`${this.state.value?this.state.value:''}`} 
          onChange={this.onChange}
          onBlur={this.onBlur}
        />

        <Textarea
          name="someInput"
          id="someInput"
          width="large"
          value={this.state.jsonShowStr}
          rows={10}
        />
      </div>
    );
  };
}

//define entity
class CurrencyEntity {
  cityName?: string;
  currencyType?: string;
  constructor(cityName?: string, currencyType?: string) {
    this.cityName = cityName;
    this.currencyType = currencyType;
  }
}

init(sdk => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }


require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//let yeomanImage = require('../images/yeoman.png');
//获取图片
let imagesData = require('../data/imagesData.json');
imagesData = (function imagesUrl(imagesArr) {
  for(var i=0,len=imagesArr.length;i<len;i++) {
    var singleImg = imagesArr[i];
    singleImg.imageUrl = require('../images/'+singleImg.imgName);
    imagesArr[i] = singleImg;
  }
  return imagesArr;
})(imagesData);
/*console.log(imagesData);*/
/**
 * 获取区间内随机值
 *
 */
function getRangeRandom(low,high) {
  return Math.ceil(Math.random()*(high-low)+low);
}

class AppComponent extends React.Component {
  Constant = {
    centerPos: {
      left: [0,1],
      right: [0,1]
    },
    hPosRange: {  //水平方向取值范围
      leftSecX: [0,1],
      rightSecX: [0,1],
      y: [0,1]
    },
    vPosRange: {  //垂直方向取值范围
      x: [0,1],
      topY: [0,1]
    }
  }
  /**
   * *
   *翻转
   */
  inverse = function (index) {
  return function () {
    var imgsArrangeArr = this.state.imgsArrangeArr;

    imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }.bind(this);
  }
  /**
   * *
   *居中
   */
  center = function (index) {
    return function () {
      this.rearrange(index);
    }.bind(this);
  }
  /**
   * 图片布局
   */
  rearrange = function(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr;
    var Constant = this.Constant;
    var centerPos = Constant.centerPos;
    var hPosRange = Constant.hPosRange;
    var vPosRange = Constant.vPosRange;
    var hPosRangeLX = hPosRange.leftSecX;
    var hPosRangeRX = hPosRange.rightSecX;
    var hPosRangeY = hPosRange.y;
    var vPosRangeTY = vPosRange.topY;
    var vPosRangeX = vPosRange.x;
    
    var imgsArrangeTopArr = [];
    var topImgNum = Math.ceil(Math.random()*2);  //取一个或者0
    var topImgSpliceIndex = 0;
    var imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
    
    //居中图
    imgsArrangeCenterArr[0]={
      pos : centerPos,
      isCenter: true
    };
    //上侧状态
    topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
    //上侧布局
    imgsArrangeTopArr.forEach(function(value,index) {
      imgsArrangeTopArr[index] = {
        pos: {
        top: getRangeRandom(vPosRangeTY[0],vPosRangeTY[1]),
        left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        isCenter: false
      };
    });
    //左右布局
    for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++) {
      var hPosRangeLORX = null;
      //前半部分在左边，后半部分在右
      if(i<k) {
        hPosRangeLORX = hPosRangeLX;
      }else {
        hPosRangeLORX = hPosRangeRX;
      }
      imgsArrangeArr[i] = {
        pos: {
        top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
        left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        isCenter: false
      }
      
    }
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }
  componentWillMount() {
    this.setState({
        imgsArrangeArr: []
    })
  }
/*  getInitialState = function() {
    return {
      imgsArrangeArr: []
    }
  }*/
  //组件加载后，每张图片的位置
  componentDidMount = function() {
    //获取舞台大小
    var stageDOM = this.refs.stage;
    var stageW = stageDOM.scrollWidth;
    var stageH = stageDOM.scrollHeight;
    var halfStageW = Math.ceil(stageW / 2);
    var halfStageH = Math.ceil(stageH / 2);
    //获取展示大小
    var imgFigureDOM = this.refs.imgFigure0.imgFigureDOM;
    console.log(this.refs.imgFigure0);
    console.log(this.refs.imgFigure0.imgFigureDOM);
    var imgW = imgFigureDOM.scrollWidth;
    var imgH = imgFigureDOM.scrollHeight;
    var halfImgW = Math.ceil(imgW / 2);
    var halfImgH = Math.ceil(imgH / 2);
    
    //中心图片位置
/*    console.log(this.refs.stage.childNodes[0].childNodes.length);
    console.log(this.refs);*/
    this.Constant.centerPos = {
      left:halfStageW-halfImgW,
      top:halfStageH-halfImgH
    }
    //左右区域
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW-halfImgW*3;
    
    this.Constant.hPosRange.rightSecX[0] = halfStageW+halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW-halfImgW;
    
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH-halfImgH;
    //上下区域
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH-halfImgH*3;
    
    this.Constant.vPosRange.x[0] = halfStageW-imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    var rea = this;
    this.rearrange(0);
/*  var rea = this;
    console.log(this.refs);
    var picCount=0;
    setInterval(function() {
      picCount += 1;
      if(picCount>8) {
        picCount=0;
        console.log(picCount);
        rea.rearrange(picCount);
        return false;
      }
      console.log(picCount);
      rea.rearrange(picCount);
    },1000)*/
    //图片点击事件
/*    var figureChild = this.refs.stage.childNodes[0].childNodes;
    var rea = this;
    console.log(figureChild);
    for(var i=0,len=figureChild.length;i<len-1;i++) {
      figureChild[i].onclick = function() {
        console.log(i);
        rea.rearrange(i);
      }
    }*/
  }
  
  render() {
    var controllerUnits = [];
    var imgFigures = [];
    imagesData.forEach(function(value,index) {
      
      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          isCenter: false
        }
      }

      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="immg-sec">
            {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}
class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.imgFigureDOM = this.getDOM.bind(this);
  }
  getDOM() {
    return this;
  }
  render() {
    var handleClick = (function (e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }.bind(this))
    var styleObj = {};
    //指定位置
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    //居中前置
    if(this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
    //className
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
    return (
      <figure className={imgFigureClassName} style={styleObj} ref={(myImg) => {this.imgFigureDOM = myImg}} onClick={handleClick}>
        <img src={this.props.data.imageUrl}
        alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

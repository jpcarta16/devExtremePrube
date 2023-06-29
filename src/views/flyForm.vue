<template>
    <!-- Título del formulario -->
    <h3>Profile Settings</h3>
    <div class="dx-fieldset">
      <!-- Campo para la posición X -->
      <div class="dx-field">
        <div class="dx-field-label">origin</div>
        <div class="dx-field-value">
          <DxNumberBox
            v-model:value="currentPath.xOrigin"
            :min="0"
            :max="100"
            :show-spin-buttons="false"
          />
          <DxNumberBox
            v-model:value="currentPath.yOrigin"
            :min="0"
            :max="100"
            :show-spin-buttons="false"
          />
        </div>
      </div>

      <!-- Campo para la posición -->
      <div class="dx-field">
        <div class="dx-field-label">end pos </div>
        <div class="dx-field-value">
          <DxNumberBox
            v-model:value="currentPath.xEnd"
            :min="0"
            :max="30"
            :show-spin-buttons="false"
          />
          <DxNumberBox
            v-model:value="currentPath.yEnd"
            :min="0"
            :max="30"
            :show-spin-buttons="false"
          />
        </div>
      </div>

      <!-- Campo para el tamaño del paso -->
      <div class="dx-field">
        <div class="dx-field-label">Step size</div>
        <div class="dx-field-value">
          <DxNumberBox
            v-model:value="stepSize"
            :min="0"
            :max="10"
            :show-spin-buttons="false"
          />
        </div>
      </div>
      <!-- Botón para ejecutar la transición -->
      <DxButton
              :width="220"
              text="Next Position"
              type="danger"
              styling-mode="contained"
              @click="buttonNext"
      />
      <!-- <button @click.prevent="transition">Next Position</button> -->

      <!-- Campo para mostrar la siguiente posición -->
      <div class="dx-field">
        <h6>Position: ({{ currentPos[0] }}, {{ currentPos[1] }})</h6>
        <p>Path: {{ pathIx }}: {{ JSON.stringify(currentPath) }}</p>
      </div>
    </div>

</template>

<script>
/**
 * Import components from DevExtreme-Vue for use the component
 */
import DxNumberBox from 'devextreme-vue/number-box';
import DxButton from 'devextreme-vue/button';

/**
 * getNextPathPosition - This function calculate the next position on the way -
 * based on the provided parameters, when it finish th calculate position, If exceeds -
 * the way limit take the Error.
 * @param {number} pos - Actual position
 * @param {number} stepSize  - Step Size
 * @param {boolean} direction - Address of motion (true - Clockwise)-(false -Conterwise)
 * @param {number} origin  - Value of origin address
 * @param {number} end  - Value of end address
 * @returns {number} - Next motion caluled
 * @throws {Error} - Take an Error if the way exceeds it the limit 
 */
// const getNextPathPosition = (pos, stepSize, direction, origin, end) => {
//   if(direction){ //clockwise - Sentido clockwise
//     if((pos+stepSize)>end) throw new Error('path overload'); 
//       return pos+stepSize; 
//   } 
//   if((pos-stepSize)<origin) throw new Error('path overload'); // Sentido Conterwise
//       return pos-stepSize;
// }

/**
 * These variables define the origin and the movements of the way 
 * @constant origin - Represent the first position with de values "x" and "y"
 * @constant movesArray - It is objects matix that define the movements on the axis "x" and "y"
 */


class Bee {
  constructor(origin, pathMovsArr, stepSize){
    
    this.origin = origin;
    this.pathMovsArr = pathMovsArr;
    
    this.stepSize = stepSize;
    this._isPositiveMov = true;
    return this;
  }

  /**
   * reset the bee position after a path cchange or origin change
   */
  _resetBeePos(){
    this._pathIx = 0;
    this.currentPos = [ this._origin.x, this._origin.y ];
    this.currentPath = {
      xOrigin: this._origin.x,
      yOrigin: this._origin.y,
      xEnd: this._origin.x+(this._pathMovsArr[0].xMov||0),
      yEnd: this._origin.y+(this._pathMovsArr[0].yMov||0),
    };
  }

  /**
   * get the next step in linear movement of bee 
   * @param {number} pos 
   * @param {number} origin 
   * @param {number} target 
   */
  _getNextAdimPosition(pos, origin, target) {
    if(pos<origin && pos<target || pos>origin && pos>target){
      throw new Error('current position out of movement range');
    }
    const stepVal = this._isPositiveMov? this._stepSize : -1*this._stepSize;
    const tmpPos = pos+stepVal;

    if(tmpPos<origin && tmpPos<target || tmpPos>origin && tmpPos>target){
      throw new Error('path overload'); 
    }
    return tmpPos;
  }


  moveStep(){
    const isXaxis = this._pathMovsArr[this._pathIx].xMov? true : false;
    try{
      if(isXaxis){
        this.currentPos[0] = this._getNextAdimPosition(
          this.currentPos[0],
          this.currentPath.xOrigin,
          this.currentPath.xEnd,
        )
      }else{
        this.currentPos[1] = this._getNextAdimPosition(
          this.currentPos[1],
          this.currentPath.yOrigin,
          this.currentPath.yEnd,
        )
      }
    }
    catch(err){
      this._pathIx+=1;
      if(this._pathIx == this._pathMovsArr.length) { // reset current path to 0 and current path origin to bee origin
        this._pathIx=0;
        this.currentPath.xOrigin = this._origin.x;
        this.currentPath.yOrigin = this._origin.y;
      }else{ // reset current path origin to former path end
        this.currentPath.xOrigin = this.currentPath.xEnd;
        this.currentPath.yOrigin = this.currentPath.yEnd;
      }
      this.currentPath.xEnd = this.currentPath.xOrigin+(this._pathMovsArr[this._pathIx].xMov||0);
      this.currentPath.yEnd = this.currentPath.yOrigin+(this._pathMovsArr[this._pathIx].yMov||0);

      this.currentPos = [this.currentPath.xOrigin, this.currentPath.yOrigin];
    }
  }
  

  set pathMovsArr(val){
    const pathsArr = [];
    if(Array.isArray(val)){ // must be a valid array
      // must have only one axis in movement per action
      // i = { xMov, yMov }
      if(val.length==0){
        this._pathMovsArr = [{ xMov: 0, yMov: 0 }];
        this._resetBeePos();
        return ;
      }
      for(const i of val){
        if((i.xMov && !i.yMov) || (!i.xMov && i.yMov)){ // movement - ok
          pathsArr.push({ xMov: i.xMov, yMov: i.yMov })
        }
        else{
          throw new Error ('movements most be  in one axis only xMov or yMov expected');
        }
      }
      this._pathMovsArr = pathsArr;
      this._resetBeePos();
    }
  }
  get pathMovsArr() { return this._pathMovsArr; }
  set stepSize(val){
    const numVal = parseFloat(val);
    if(numVal==null || isNaN(numVal)) throw new Error('step size must be a number')
    if(numVal>0){// stepsize will be always possitive
      this._stepSize=numVal;
      this._isPositiveMov=true;
    }else{
      this._stepSize=-numVal;
      this._isPositiveMov=false;
    }
  }
  get stepSize(){ 
    return this._isPositiveMov? this._stepSize : -1*this._stepSize;
  }
  set origin(val){
    // validate origin for array of 2
    if(!!val?.length && val?.length==2){
      const [xOrigin, yOrigin] = val;
      this._origin={ x: xOrigin, y: yOrigin };
      if(this._pathMovsArr?.length) this._resetBeePos();
    }else{
      throw new Error('origin must be a 2 number array in [x, y]');
    }
  }
  get origin(){ 
    return [ this._origin.x, this._origin.y ]; 
  }
  _moveUnidir(){}


}

export default {
  components: {
    DxButton,
    DxNumberBox,
  },


  /**
   * This function return objets reactive data, here define the propertis:
   * that store and control the state and components values.
   */
  data() {
    return new Bee([10, 5], [], 2)
    
  },
  computed: {
  },

  /**
   * Metodo que s eejcuyta cuando se hace clic en el botón "Next Position"
   * Actualiza las posiciciones basadas en el camino actual y avanza al siguiente camino -
   * si este es necesario
   */
  methods: {
      
    },
  }

</script>

<style>
#custom-height-slider {
  height: 75px;
}

dx-field > .dx-rangeslider {
  flex: 1;
}

#form {
  max-width: 600px;
  margin: auto;
}

.button {
  margin-top: 50px;
  margin-right: 20px;
  float: right;
}

.fileuploader-container {
  border: 1px solid #d3d3d3;
  margin: 20px 20px 0 20px;
}

#form h3 {
  margin-left: 20px;
  font-weight: normal;
  font-size: 22px;
}
</style>


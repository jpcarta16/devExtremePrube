export default class Bee {
  constructor(origin, pathMovsArr, stepSize) {
    this.origin = origin; // origin of the bee
    this.pathMovsArr = pathMovsArr; // Array of bee movements
    this.stepSize = stepSize; // bee step size
    this._isPositiveMov = true; // Indicates if the movement is positive
  }

  _resetBeePos() {
    this._pathIx = 0; // Index of the current route in the movements array
    this.currentPos = [this.origin.x, this.origin.y]; // current position of the bee
    this.currentPath = {
      xOrigin: this.origin.x, // x-coordinate of the origin of the current route
      yOrigin: this.origin.y, // Y-coordinate of the origin of the current route
      xEnd: this.origin.x + (this.pathMovsArr[0].xMov || 0), // x-coordinate of the end of the current path
      yEnd: this.origin.y + (this.pathMovsArr[0].yMov || 0), // Y-coordinate of the end of the current route
    };
  }

  _getNextAdimPosition(pos, origin, target) {
    const stepVal = this._isPositiveMov ? this.stepSize : -this.stepSize; // Step value according to the direction of movement
    const tmpPos = pos + stepVal; // new temporary position

    const isOutOfRange =
      (stepVal > 0 && (tmpPos < origin || tmpPos > target)) || // Check if the position is out of range in positive direction
      (stepVal < 0 && (tmpPos > origin || tmpPos < target)); // Comprueba si la posición está fuera del rango en dirección negativa

    if (isOutOfRange) {
      throw new Error('current position out of movement range'); // Throw an error if the position is out of range of motion
    }

    return tmpPos; // Returns the new position
  }

  moveStep() {
    const isXaxis = this.pathMovsArr[this._pathIx].xMov ? true : false; // Indicates if the movement is in the x axis

    try {
      if (isXaxis) {
        this.currentPos[0] = this._getNextAdimPosition(
          this.currentPos[0],
          this.currentPath.xOrigin,
          this.currentPath.xEnd
        ); // Gets the next position on the x-axis
      } else {
        this.currentPos[1] = this._getNextAdimPosition(
          this.currentPos[1],
          this.currentPath.yOrigin,
          this.currentPath.yEnd
        ); // Gets the next position on the y-axis
      }
    } catch (err) {
      this._pathIx += 1; // Increment the index of the current path

      if (this._pathIx === this.pathMovsArr.length) {
        // If the end of the movement array is reached, the path is reset to zero and the origin to the origin of the bee.
        this._pathIx = 0;
        this.currentPath.xOrigin = this.origin.x;
        this.currentPath.yOrigin = this.origin.y;
      } else {
        // If the end of the motion array was not reached, the origin is reset to the end position of the previous path
        this.currentPath.xOrigin = this.currentPath.xEnd;
        this.currentPath.yOrigin = this.currentPath.yEnd;
      }

      // Calculate the new end of the current path
      this.currentPath.xEnd = this.currentPath.xOrigin + (this.pathMovsArr[this._pathIx].xMov || 0);
      this.currentPath.yEnd = this.currentPath.yOrigin + (this.pathMovsArr[this._pathIx].yMov || 0);

      this.currentPos = [this.currentPath.xOrigin, this.currentPath.yOrigin]; // Actualiza la posición actual a la nueva ruta
    }
  }

  set pathMovsArr(val) {
    const pathsArr = [];

    if (Array.isArray(val)) {
      if (val.length === 0) {
        this._pathMovsArr = [{ xMov: 0, yMov: 0 }]; // If the moves array is empty, a null move is set by default
        this._resetBeePos();
        return;
      }

      for (const i of val) {
        if ((i.xMov && !i.yMov) || (!i.xMov && i.yMov)) {
          // Check that the movement is in a single axis (xMov or yMov)
          pathsArr.push({ xMov: i.xMov, yMov: i.yMov }); // Add the valid move to the new array
        } else {
          throw new Error('movements must be in one axis only (xMov or yMov)'); // Throw an error if there is an invalid move
        }
      }

      this._pathMovsArr = pathsArr; // Update the moves array with the valid moves
      this._resetBeePos(); // Resets the bee position
    }
  }

  get pathMovsArr() {
    return this._pathMovsArr;
  }

  set stepSize(val) {
    const numVal = parseFloat(val);

    if (numVal == null || isNaN(numVal)) throw new Error('step size must be a number'); // Throw an error if the step size is not a number

    this._stepSize = Math.abs(numVal); // Stores the absolute value of the step size
    this._isPositiveMov = numVal >= 0; // Updates direction of movement based on step size
  }

  get stepSize() {
    return this._isPositiveMov ? this._stepSize : -1 * this._stepSize; // Returns the size of the step with the proper direction
  }

  set origin(val) {
    if (!!val?.length && val?.length === 2) {
      const [xOrigin, yOrigin] = val;
      this.origin = { x: xOrigin, y: yOrigin }; // Update the origin of the bee

      if (this.pathMovsArr?.length) this._resetBeePos(); // If there are defined movements, reset the position of the bee
    } else {
      throw new Error('origin must be a 2 number array in [x, y]'); // Throw an error if the source is not an array of 2 numbers
    }
  }

  get origin() {
    return { x: this.origin.x, y: this.origin.y }; // Returns the origin of the bee as an object {x, y}
  }
}


// En este código corregido, se han realizado las siguientes modificaciones:

// 1. Se ha corregido el acceso a las propiedades `origin`, `pathMovsArr` y `stepSize` utilizando la notación de punto (`.`) en lugar de la notación de subíndice (`[]`).

// 2. En el método `_resetBeePos`, se ha corregido el acceso a la propiedad `origin` utilizando la notación de punto.

// 3. En el método `_getNextAdimPosition`, se ha corregido el acceso a las propiedades `stepSize` y `_isPositiveMov` utilizando la notación de punto.

// 4. En el método `moveStep`, se ha corregido el acceso a las propiedades `pathMovsArr` y `origin` utilizando la notación de punto.

// 5. En el método `set origin`, se ha corregido el acceso a las propiedades `pathMovsArr` y `origin` utilizando la notación de punto.

// 6. En el método `get origin`, se ha corregido el acceso a las propiedades `origin.x` y `origin.y` utilizando la notación de punto.

// Con estas correcciones, la clase `Bee` ahora debería aceptar correctamente los movimientos negativos en los ejes x e y.

<template>
  <div class="bee-container">
    <h1 class="header">Bee Animation</h1>
    <div class="content">
      <div class="svg-container">
        <!-- SVG to show the lines and circles of the bees -->
        <svg width="800" height="600" class="svg">
          <g class="path-lines">
            <!-- Generates the route lines for each bee -->
            <path
              v-for="(bee, index) in bees"
              :key="'line-' + index"
              :d="generatePath(bee.start, bee.paths)"
              :class="[
                'path-line',       
                { 'path-line-current': bee.currentPath === index },
                { 'path-line-final': bee.currentPath === bee.paths.length - 1 }
              ]"
            />
          </g>
          <!-- Representation of every bee -->
          <g v-for="(bee, index) in bees" :key="index">
            <!-- Draw the bee's path if animation is enabled -->
            <path
              v-if="bee.animationEnabled"
              :d="generatePath(bee.start, bee.paths)"
              class="bee-path path-line"
            />
            <!-- Draw the circle of the bee in its current position -->
            <circle
              :cx="bee.start[0]"
              :cy="bee.start[1]"
              r="10"
              class="bee"
            />
            <!-- Show the name of the bee near the circle -->
            <text :x="bee.start[0] + 15" :y="bee.start[1] - 5" class="bee-label">
              {{ bee.name }}
            </text>
            <!-- Shows the location of the bee near the circle -->
            <text :x="bee.start[0] + 15" :y="bee.start[1] + 15" class="bee-label">
              {{ bee.location[0] }}, {{ bee.location[1] }}
            </text>
          </g>
        </svg>
        <!-- Animation state and control buttons -->
        <div class="status-row">
          <p class="status">{{ animationEnabled ? 'Animation running' : 'Animation stopped' }}</p>
          <div class="buttons">
            <!-- Button to start the animation -->
            <button class="button start-button" @click="startAnimation" :disabled="animationEnabled">
              Start
            </button>
            <!-- Button to stop the animation -->
            <button class="button stop-button" @click="stopAnimation" :disabled="!animationEnabled">
              Stop
            </button>
            <button class="button next-position" @click="nextPoisition"> Next Position</button>
          </div>
        </div>
      </div>
      <!-- Form to add new bees and edit their properties -->
      <div class="form-container">
        <div class="form-group">
          <label class="label">Name:</label>
          <!-- Input field for the name of the bee -->
          <input type="text" v-model="newBee.name" />
        </div>
        <div class="form-group">
          <label class="label">Bee Step:</label>
          <!-- Passage of the bee on the route -->
          <input type="number" v-model="newBee.step" min="0" />
        </div>
        <div class="form-group">
          <label class="label">Bee Start Position:</label>
          <!-- X coordinate of the initial position of the bee -->
          <div class="form-row">
            <label>X:</label>
            <input type="number" v-model="newBee.start[0]" />
          </div>
          <!-- Y coordinate of the initial position of the bee -->
          <div class="form-row">
            <label>Y:</label>
            <input type="number" v-model="newBee.start[1]" />
          </div>
        </div>
        <div class="form-group">
          <label class="label">Bee Paths:</label>
          <!-- Inputs for the X and Y coordinates of each step in the bee's path -->
          <div class="path-row" v-for="(path, pathIndex) in newBee.paths" :key="pathIndex">
            <div class="form-row">
              <label>X Movement:</label>
              <input type="number" v-model="path.xMov" />
            </div>
            <div class="form-row">
              <label>Y Movement:</label>
              <input type="number" v-model="path.yMov" />
            </div>
          </div>
          <!-- Button to add a new step to the bee's path -->
          <button class="button add-path-button" @click="addPath">Add Path</button>
        </div>
        <!-- Botón para agregar una nueva abeja -->
        <button class="button add-bee-button" @click="addBee">Add Bee</button>
      </div>

    </div>
    <!-- Slider to adjust animation speed -->
    <div class="slider-container">
      <label>Speed in Ms:</label>
      <input type="range" v-model="animationSpeed" min="100" max="2000" step="100" />
    </div>

    <div v-if="error" class="notification">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { BeesArray } from './data.js';

export default {
  data() {
    return {
      beesData: BeesArray, // Initial bee data
      bees: [], // Array to store the added bees
      animationEnabled: false, // Indicates if the animation is enabled or stopped
      animationIntervalId: null, // animation interval ID
      animationSpeed: 500, // animation speed
      newBee: {
        // Data of a new bee to add
        name: '',
        location: [0, 0],
        step: 0,
        start: [0, 0],
        paths: [{ xMov: 0, yMov: 0 }]
      },
      error: null
    };
  },
  methods: {
    // Method that generates an SVG route from the start data and the steps of a bee,
     // taking two parameters:
     // - Start - Start coordinates
     // - Paths - An array of objects representing the bee's movements
    generatePath(start, paths) {
      let path = `M ${start[0]} ${start[1]}`;
      let x = start[0];
      let y = start[1];

      for (let i = 0; i < paths.length; i++) {
        const { xMov, yMov } = paths[i];
        x = x + xMov;
        y = y + yMov;
        path += ` L ${x} ${y}`;
      }

      return path;
    },
    // Method indicating starts animation if not enabled, sets 
    // "animationEnable " - true 
    // "setInterval" - calls the "moveBees" method every "animationSpeed" in milliseconds
    startAnimation() {
      if (!this.animationEnabled) {
        this.animationEnabled = true;
        this.animationIntervalId = setInterval(this.moveBees, this.animationSpeed);
      }
    },

    nextPoisition() {
      if (!this.animationEnabled) {
        this.animationEnabled = false;
        this.
        this.animationIntervalId = setInterval(this.moveBees, this.animationSpeed);
      }
    },


    // Method that stops the animation if it is enabled
     // Set "animationEnable - False" Using it to identify the "clearIntervalID" 
    stopAnimation() {
      if (this.animationEnabled) {
        this.animationEnabled = false;
        clearInterval(this.animationIntervalId);
      }
    },
    // Method that moves the bees in its path, Iterates over the array [bees]
     // update the "Start" coordinates according to the movements defined in 'paths'
    moveBees() {
      this.bees.forEach(bee => {
        const currentPath = bee.paths[bee.step];
        if (currentPath) {
          const { xMov, yMov } = currentPath;
          bee.start[0] += xMov;
          bee.start[1] += yMov;
          bee.step = (bee.step + 1) % bee.paths.length;
          bee.currentPath = bee.step; // Updates the index of the current path of the bee
        } else {
          bee.step = 0; // Return to the first step of the route
        }
      });
    },
    // A method that adds a new empty step to the route of the bee "newBee"
    addPath() {
      this.newBee.paths.push({ xMov: 0, yMov: 0 });
    },
    // Method that adds a new bee to the "bees" array if the data from -
     // "newBee" are valid, otherwise display an alert that they need to be completed
     // all fields with valid values
    addBee() {
      if (this.isValidBee()) {
        this.bees.push({ ...this.newBee });
        this.resetNewBee();
      } else {
        this.error = 'Please fill in all the fields with valid values'
        setTimeout(() => {
          this.error = null
        }, 3000) // El mesnaje de error desaparecerá después de 3 segundos (3000 milisegundos)
      }
    },
    // Method that resets the data of 'newBee' set default values
    resetNewBee() {
      this.newBee = {
        name: '',
        location: [0, 0],
        step: 0,
        start: [0, 0],
        paths: [{ xMov: 0, yMov: 0 }]
      };
    },
    // Method that validates the data of 'newBee' and returns 'true' if all required fields-
     // have valid values
    isValidBee() {
      const { name, location, step, start, paths } = this.newBee;
      return (
        name.trim() !== '' &&
        location[0] !== undefined &&
        location[1] !== undefined &&
        step !== undefined &&
        start[0] !== undefined &&
        start[1] !== undefined &&
        paths.length > 0
      );
    }
  }
};
</script>

<style scoped>
.bee-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
}

.header {
  text-align: center;
  font-size: 40px;
  margin-bottom: 20px;
}

.content {
  display: flex;
  align-items: center;
}

.svg-container {
  position: relative;
  margin-right: 40px;
}

.svg {
  border: 1px solid #ccc;
}

.path-line {
  fill: none;
  stroke: #999;
  stroke-width: 2px;
  stroke-dasharray: 4;
}

.path-line-current {
  stroke: #000;
}

.notification {
  background-color:  #f44336;
  color: #fff;
  padding: 10px;
  margin-bottom: 10px;
}

.path-line-final {
  stroke: #f00;
  stroke-dasharray: none;
}

.bee {
  fill: #ffcc00;
  stroke: #000;
  stroke-width: 1px;
}

.bee-label {
  fill: #000;
  font-size: 12px;
  font-weight: bold;
}

.status-row {
  display: flex;
  align-items: center;
  margin-top: 30px;
}

.status {
  margin-right: 30px;
  text-align: center
}

.buttons {
  display: flex;
}

.button {
  padding: 8px 16px;
  margin-right: 10px;
}

.start-button {
  background-color: #008000;
  color: #fff;
}

.stop-button {
  background-color: #f00;
  color: #fff;
}

.next-position {
  background-color: #008000;
  color: #fff;
}

.form-container {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.path-row {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.add-path-button {
  padding: 4px 8px;
}

.add-bee-button {
  padding: 8px 16px;
  margin-top: 10px;
  background-color: #008000;
  color: #fff;
}

.slider-container {
  margin-top: 20px;
}

.slider-container label {
  margin-right: 10px;
}
</style>

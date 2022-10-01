import './style.css'
import { LineChart } from './charts/line'
import { AnimationType, Dataset } from './charts/line/types/parameters'

const highest = {
  x: 1333,
  y: 728,
}

const size = {
  width: 500,
  height: 300,
  padding: {
    top: 50,
    bottom: '10%',
    left: 50,
    right: 50,
  },
}

const chart = new LineChart(
  document.querySelector('#line-chart') as HTMLElement,
  {
    size,

    withStartPoint: false,
    withFinishPoint: false,

    animation: {
      type: AnimationType.CROP_X,
      duration: 3000,
    },
    style: {
      background: 'lime',
      grid: {
        gap: 50,
        lineWidth: 1,
        strokeStyle: 'rgba(0,0,0,0.5)',
      },
      path: {
        strokeStyle: 'black',
        lineWidth: 5,
      },
      point: {
        size: 10,
        fillStyle: 'white',
      },
      pointHover: {
        size: 20,
        fillStyle: 'yellow',
        shadowOffsetY: 5,
        shadowBlur: 10,
        shadowColor: 'green',
      },
    },
    highest,
    datasets: [
      {
        style: {
          path: {
            strokeStyle: 'black',
          },
          point: {
            size: 10,
          },
          pointHover: {
            size: 20,
            fillStyle: 'yellow',
            shadowOffsetY: 5,
            shadowBlur: 10,
            shadowColor: 'green',
          },
          pointSelected: {
            size: 20,
            fillStyle: 'orange',
            shadowOffsetY: 5,
            shadowBlur: 10,
            shadowColor: 'green',
          },
        },

        data: [
          { x: 0, y: 700 },
          { x: 427, y: 54 },
          { x: 711, y: 367 },
          { x: 1008, y: 0 },
          { x: 1333, y: 728 },
        ],
      },
      {
        style: {
          path: {
            strokeStyle: 'black',
            lineWidth: 10,
          },
          point: {
            size: 15,
          },
          pointHover: {
            size: 20,
            fillStyle: 'pink',
            shadowOffsetY: 5,
            shadowBlur: 10,
            shadowColor: 'green',
          },
          pointSelected: {
            size: 20,
            fillStyle: 'purple',
            shadowOffsetY: 5,
            shadowBlur: 10,
            shadowColor: 'green',
          },
        },

        data: [
          { x: 523, y: 425 },
          { x: 23, y: 524 },
          { x: 876, y: 708 },
          { x: 1000, y: 0 },
          { x: 1333, y: 555 },
        ],
      },
    ],
  }
)

chart.emitter.on('pointEnter', console.log.bind(null, 'enter'))
chart.emitter.on('pointLeave', console.log.bind(null, 'leave'))
chart.emitter.on('pointSelect', console.log.bind(null, 'pointSelect'))
chart.emitter.on('pointUnselect', console.log.bind(null, 'pointUnselect'))

console.log(chart)

document.querySelector('.js-play')?.addEventListener('click', chart.play)

document.querySelector('.js-data')?.addEventListener('click', () => {
  const getRandomColor = (): string =>
    `rgba(${Array(3)
      .fill(255)
      .map((value) => value * Math.random())
      .join(',')}, ${Math.min(Math.random() + 0.3, 1)}`

  const createDataset = (): Dataset => ({
    data: Array(5)
      .fill({ x: 0, y: 0 })
      // .map(() => ({
      //   x: highest.x * Math.random(),
      //   y: highest.y * Math.random(),
      // })),
      .map(() => highest.y * Math.random()),
    // style: {
    //   path: {
    //     strokeStyle: 'black',
    //     fillStyle: getRandomColor(),
    //     lineWidth: 5,
    //   },
    // },
  })

  chart
    .setDatasets(
      Array(2)
        .fill(null)
        .map(() => createDataset())
    )
    .updateParameters({
      size: {
        width: 500,
        height: 200,
        padding: {
          top: 50,
          bottom: '10%',
          left: 50,
          right: 50,
        },
      },
      highest: { y: highest.y },
      style: {
        background: getRandomColor(),
        path: {
          strokeStyle: 'black',
          fillStyle: getRandomColor(),
          lineWidth: 5,
        },
        grid: {
          gap: 5 + Math.round(Math.random() * 45),
          lineWidth: Math.round(5 * Math.random()),
          strokeStyle: getRandomColor(),
        },
        point: {
          size: 15,
          fillStyle: 'black',
        },
        pointHover: {
          size: 20,
          fillStyle: 'pink',
          shadowOffsetY: 5,
          shadowBlur: 10,
          shadowColor: 'green',
        },
        pointSelected: {
          size: 20,
          fillStyle: 'purple',
          shadowOffsetY: 5,
          shadowBlur: 10,
          shadowColor: 'green',
        },
      },
    })
})

const timingFunction = document.querySelector<HTMLSelectElement>(
  '.js-timing-function'
)

if (timingFunction) {
  timingFunction.innerHTML = Object.keys(LineChart.animationTimingFunction)
    .map((key) => `<option>${key}</option>`)
    .join('')
  timingFunction.addEventListener('change', () => {
    chart.updateParameters({
      size,
      highest,
      animation: {
        type: AnimationType.CROP_X,
        duration: 3000,
        timingFunction:
          LineChart.animationTimingFunction[
            timingFunction.value as keyof typeof LineChart.animationTimingFunction
          ],
      },
    })
  })
}

<template>
  <div class="layout">
    <Menu class="nuv-menu" mode="horizontal" theme="light">
        <span class="logo">客户满意度调查</span>
    </Menu>
    <div class="layout-content">
        <Row>
            <Col span="5">
              <Menu class="menu" active-name="1-2" width="auto" height="900" :open-names="['1']" @on-select="selectProject">
                <Submenu name="1">
                  <template slot="title">
                    <Icon type="folder"></Icon>
                    项目列表
                  </template>
                  <div v-for="(project, index) of allProjects" :key="index">
                  <MenuItem :name="index"> {{ project.name }} </MenuItem>
                  </div>
                </Submenu>
              </Menu>
            </Col>
            <Col span="19">
              <div class="layout-breadcrumb">
                <Breadcrumb>
                  <BreadcrumbItem>首页</BreadcrumbItem>
                  <BreadcrumbItem> {{ currentProjectName.name }}</BreadcrumbItem>
                </Breadcrumb>
              </div>
              <div class="layout-content-main">
                <Card v-if="showAllDistributors" class="card">
                  <template slot="title">
                    <Icon type="ios-world-outline"></Icon>
                    所有经销商
                    <Button type="primary" class="check-button" size="small" @click="addDistributorConfirm">添加经销商</Button>
                  </template>
                    <a v-for="(distributor, index) of allDistributors" :key="index" class="a-distributor" @click="selectDistributor(index)"><Icon type="link"></Icon> {{ distributor.name }} </a>
                </Card>
                <Card v-if="showReportForm">
                  <template slot="title">
                    <Icon type="person-stalker"></Icon>
                    经销商名字
                    <Button type="primary" class="check-button" size="small" @click="voiceDataCheckConfirm">检查</Button>
                  </template>
                  <div class="data-check">得分：{{ '九十分' }}</div>
                  <div class="data-check">累计检查通话数 {{ '5000' }}</div>
                  <div class="data-check">累计疑似通话 {{ '20' }}</div>
                  <h2 class="title">
                    报表
                  </h2>
                  <Table :columns="reportFormColumn" :data="reportFormData" @on-row-click="showReportFormDetail"></Table>
                </Card>
                <Card v-if="showFirstChart">
                  <template slot="title">
                    <Icon type="person-stalker"></Icon>
                    经销商名字
                    <Button type="primary" class="check-button" size="small" @click="backToReportFrom">返回</Button>
                    <Button type="primary" class="check-button" size="small" @click="exportReport">导出报表</Button>
                  </template>
                  <div class="data-check">得分：{{ '九十分' }}</div>
                  <div class="data-check">累计检查通话数 {{ '5000' }}</div>
                  <div class="data-check">累计疑似通话 {{ '20' }}</div>
                  <h2 class="title">
                    详情
                  </h2>
                    <div class="echarts">
                    <IEcharts :option="reportOption"></IEcharts>
                    </div>
                    <div id="firstReportChart" style="height:350px;width:80%"></div>
                </Card>
                <Card v-if="showSecondChart">
                  <template slot="title">
                    <Icon type="person-stalker"></Icon>
                    经销商名字
                    <Button type="primary" class="check-button" size="small" @click="backToReportFrom">返回</Button>
                    <Button type="primary" class="check-button" size="small" @click="exportReport">导出报表</Button>
                  </template>
                  <div class="data-check">得分：{{ '九十分' }}</div>
                  <div class="data-check">累计检查通话数 {{ '5000' }}</div>
                  <div class="data-check">累计疑似通话 {{ '20' }}</div>
                  <h2 class="title">
                    详情
                  </h2>
                    <h1>第二张图表</h1>
                    <div id="secondtReportChart" style="height:500px;width:80%"></div>
                </Card>
                <Modal
                  v-model="addDistributorDialog"
                  title="添加经销商"
                  :loading="addDistributorLoading"
                  @on-ok="addDistributor">
                  <Input v-model="addDistributorName">
                    <span slot="prepend">经销商名称</span>
                  </Input>
                </Modal>
                <Modal
                  v-model="voiceDataCheckDialog"
                  title="检查"
                  :loading="voiceDataCheckLoading"
                  @on-ok="voiceDataCheck">
                  <Input v-model="voiceDataPath">
                    <span slot="prepend">语音路径</span>
                  </Input>
                </Modal>
              </div>
            </Col>
        </Row>
    </div>
    <div class="layout-copy">
      2017 &copy; shayumaoliang
    </div>
  </div>
</template>
<script>
  const echarts = require('echarts')
  export default {
    data () {
      return {
        reportOption: {
          backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
            offset: 0,
            color: '#f7f8fa'
          }, {
            offset: 1,
            color: '#cdd0d5'
          }]),
          title: {
            text: '相似通话集合'
          },
          // legend: {
          //   right: 10,
          //   data: ['1990']
          // },
          xAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            scale: true
          },
          series: [{
            // name: '1990',
            data: [[1, 0, 1, '1'], [3, 1, 3, '3'], [3, 2, 3, '3'], [8, 3, 8, '8']],
            type: 'scatter',
            symbolSize: function (data) {
              return data[2] * 10
            },
            label: {
              emphasis: {
                show: true,
                formatter: function (param) {
                  return param.data[3]
                },
                position: 'inside'
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: 5,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: 'rgb(251, 118, 123)'
                }, {
                  offset: 1,
                  color: 'rgb(204, 46, 72)'
                }])
              }
            }
          }]
        },
        showSecondChart: false,
        voiceDataPath: null,
        voiceDataCheckLoading: true,
        voiceDataCheckDialog: false,
        addDistributorName: null,
        addDistributorLoading: true,
        addDistributorDialog: false,
        showAllDistributors: false,
        showReportForm: false,
        showFirstChart: false,
        reportFormColumn: [
          {
            title: '检查时间',
            key: 'checkedTime'
          },
          {
            title: '检查进度',
            key: 'checkProgress'
          },
          {
            title: '单次检查数',
            key: 'checkNum'
          },
          {
            title: '疑似通话',
            key: 'similarCall'
          }
        ],
        reportFormData: [
          {
            checkedTime: '2017-10-26',
            checkProgress: '100%',
            checkNum: 213,
            similarCall: 5
          },
          {
            checkedTime: '2017-10-26',
            checkProgress: '100%',
            checkNum: 213,
            similarCall: 5
          },
          {
            checkedTime: '2017-10-26',
            checkProgress: '100%',
            checkNum: 213,
            similarCall: 5
          }
        ],
        allDistributors: [
          {
            name: '河北经销商'
          },
          {
            name: '河南经销商'
          },
          {
            name: '河东经销商'
          },
          {
            name: '河西经销商'
          }
        ],
        allProjects: [
          {
            name: '春季检查'
          },
          {
            name: '夏季检查'
          },
          {
            name: '秋季检查'
          },
          {
            name: '冬季检查'
          }
        ],
        allProjectsName: [],
        currentProjectName: {
          name: null
        },
        projectIndex: null,
        chartData: [[1, 0, 1, '1'], [3, 1, 3, '3'], [3, 2, 3, '3'], [8, 3, 8, '8']],
        graphData: {
          nodes: [{
            name: '1',
            x: 10,
            y: 10,
            value: 10
          }, {
            name: '2',
            x: 100,
            y: 100,
            value: 20,
            symbolSize: 20,
            itemStyle: {
              normal: {
                color: 'red'
              }
            }
          }],
          links: [{
            source: '1',
            target: '2'
          }]
        },
        categories: ['1']
      }
    },
    methods: {
      addDistributorConfirm () {
        this.addDistributorName = null
        this.addDistributorDialog = true
      },
      async addDistributor () {
        await setTimeout(() => {
          this.allDistributors.push({ name: this.addDistributorName })
          this.addDistributorDialog = false
          this.$Message.success('添加成功')
        }, 2000)
      },
      voiceDataCheckConfirm () {
        this.voiceDataCheckDialog = true
      },
      voiceDataCheck () {
        setTimeout(() => {
          this.voiceDataCheckDialog = false
        }, 2000)
      },
      selectDistributor (index) {
        this.showFirstChart = false
        this.showReportForm = true
      },
      backToReportFrom () {
        this.showFirstChart = false
        this.showReportForm = true
      },
      exportReport () {
        this.$Message.success('导出成功')
      },
      showReportFormDetail (index) {
        this.showReportForm = false
        this.showFirstChart = true
        // this.$nextTick(function () {
        //   this.drewFirstReport()
        // })
      },
      selectProject (name) {
        this.projectIndex = name
        this.showAllDistributors = true
        this.showFirstChart = false
        this.showReportForm = false
        this.currentProjectName['name'] = this.allProjects[name].name
      },
      async getAllProjects () {
        try {
          this.allProjects = []
          const res = await this.$http({
            method: 'GET',
            url: this.$apiUrl + '/allprojects'
          })
          if (res.data.code === 0) {
            const allProjects = res.data.projects
            for (let i = 0; i < allProjects.length; i++) {
              const project = {}
              project['id'] = allProjects[i].project_name
              project['name'] = allProjects[i].id
              // project['dealers'] = allProjects[i].dealers
              this.allProjects.push(project)
            }
          }
        } catch (e) {
          this.$message({
            type: 'error',
            showClose: true,
            message: e
          })
        }
      },
      // newReportChart (id, option) {
      //   const myChart = echarts.init(document.getElementById(id), 'macarons')
      //   myChart.setOption(option)
      // },
      drewFirstReport () {
        const myChart = echarts.init(document.getElementById('firstReportChart'), 'macarons')
        myChart.setOption({
          backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
            offset: 0,
            color: '#f7f8fa'
          }, {
            offset: 1,
            color: '#cdd0d5'
          }]),
          title: {
            text: '相似通话集合'
          },
          // legend: {
          //   right: 10,
          //   data: ['1990']
          // },
          xAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            scale: true
          },
          series: [{
            // name: '1990',
            data: this.chartData[0],
            type: 'scatter',
            symbolSize: function (data) {
              return data[2] * 10
            },
            label: {
              emphasis: {
                show: true,
                formatter: function (param) {
                  return param.data[3]
                },
                position: 'inside'
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: 5,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: 'rgb(251, 118, 123)'
                }, {
                  offset: 1,
                  color: 'rgb(204, 46, 72)'
                }])
              }
            }
          }]
        })
        myChart.on('click', function (params) {
          setTimeout(function () {
            console.log(params)
            console.log('点击==================================》成功')
            const myChart = echarts.getInstanceByDom(document.getElementById('firstReportChart'), 'macarons')
            myChart.setOption({
              title: {
                text: '通话记录',
                subtext: 'Default layout',
                top: 'bottom',
                left: 'right'
              },
              tooltip: {},
              legend: [{
                // selectedMode: 'single',
                data: this.categories
              }],
              animationDuration: 1500,
              animationEasingUpdate: 'quinticInOut',
              series: [
                {
                  name: 'Les Miserables',
                  type: 'graph',
                  layout: 'none',
                  data: [{
                    name: '第一个通话',
                    x: 10,
                    y: 10,
                    value: 10,
                    symbolSize: 30
                  }, {
                    name: '第二个通话',
                    x: 10,
                    y: 20,
                    value: 20,
                    symbolSize: 30
                    // itemStyle: {
                    //   normal: {
                    //     color: 'red'
                    //   }
                    // }
                  }],
                  links: [{
                    source: '第一个通话',
                    target: '第二个通话',
                    weight: 1
                  }],
                  categories: '1',
                  roam: true,
                  label: {
                    normal: {
                      position: 'right',
                      formatter: '{b}'
                    }
                  },
                  lineStyle: {
                    normal: {
                      color: 'source',
                      curveness: 0.3
                    }
                  }
                }
              ]
            })
          }, 1000)
        })
      }
    },
    mounted () {
      // this.getAllProjects()
    }
  }
</script>
<style scoped>
  .layout{
      border: 1px solid #d7dde4;
      background: #f5f7f9;
      box-sizing: border-box;
      min-height: 100%;
  }
  .data-check{
    overflow: auto;
    float: left;
    margin-left: 20px;
    margin-bottom: 10px;
  }
  .title{
    clear: left;
  }
  .check-button{
    float: right;
    margin-right: 20%;
    margin-bottom: 20px;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .logo{
    top: 15px;
    font-size: 25px;
    margin-left: 20px;
    margin-bottom: 20px;
  }
  .menu{
    min-height: 100%;
    border: 10px
  }
  .layout-logo{
      width: 100px;
      height: 30px;
      background: #d7dde4;
      border-radius: 3px;
      float: left;
      position: relative;
      top: 15px;
      left: 20px;
  }
  .nuv-menu{
    height: 10%;
  }
  .layout-assistant{
      width: 300px;
      margin: 0 auto;
      height: inherit;
  }
  .layout-content{
      height: 80%;
      margin: 15px;
      /* overflow: hidden; */
      background: #fff;
      border-radius: 4px;
  }
  .layout-content-main{
      padding: 10px;
  }
  .layout-copy{
      height: 10%;
      text-align: center;
      padding: 0 0 0;
      color: #9ea7b4;
      margin-top: 5px;
  }
  .echarts {
    width: 80%;
    height: 400px;
  }
  .a-distributor{
    float: left;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 20px;
  }
  .card{
    padding: 5px;
    padding-bottom: 10px;
  }
</style>

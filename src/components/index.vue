<template>
  <div class="layout">
    <Menu class="nuv-menu" mode="horizontal" theme="light">
        <span class="logo">客户满意度调查</span>
    </Menu>
    <div class="layout-content">
      <Col span="5">
        <Button type="primary" class="add-button" size="small" @click="addProjectConfirm">添加项目</Button>
        <Menu class="menu" width="auto" height="900" :open-names="['1']" @on-select="selectProject">
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
            <BreadcrumbItem a="/" @click="toShowAllDistributors"> {{ currentProjectName.name }}</BreadcrumbItem>
            <BreadcrumbItem> {{ currentDistributorName.name }}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div class="layout-content-main">
          <Card v-if="showAllDistributors" class="card">
            <template slot="title">
              <Icon type="ios-world-outline"></Icon>
              经销商列表
              <Button type="primary" class="check-button" size="small" @click="deleteProjectConfirm">删除项目</Button>
              <Button type="primary" class="delete-button" size="small" @click="addDistributorConfirm">添加经销商</Button>
            </template>
              <a v-for="(distributor, index) of allDistributors" :key="index" class="a-distributor" @click="selectDistributor(index)"><Icon type="link"></Icon> {{ distributor.name }} </a>
          </Card>
          <Card v-if="showReportForm">
            <template slot="title">
              <Icon type="person-stalker"></Icon>
              经销商： {{ currentDistributorName.name }}
              <Button type="primary" class="check-button" size="small" @click="deleteDistrubutorConfirm">删除该经销商</Button>
              <Button type="primary" class="delete-button" size="small" @click="voiceDataCheckConfirm">检查</Button>
            </template>
            <div class="data-check">得分：{{ totalResult.score }}</div>
            <div class="data-check">累计检查通话数：{{ totalResult.allCheckedNum }}</div>
            <div class="data-check">累计疑似通话：{{ totalResult.allSimilarNum }}</div>
            <h2 class="title">
              报表
            </h2>
            <span>*双击查看图表*</span>
            <Table :columns="reportFormColumn" :data="reportFormData" @on-row-dblclick="showReportFormDetail"></Table>
          </Card>
          <Card v-if="showFirstChart">
            <template slot="title">
              <Icon type="person-stalker"></Icon>
              经销商： {{ currentDistributorName.name }}
              <Button type="primary" class="check-button" size="small" @click="backToReportFrom">返回</Button>
              <Button type="primary" class="check-button" size="small" @click="exportReport">导出报表</Button>
            </template>
            <div class="data-check">当前得分：{{ currentResult.score }}</div>
            <div class="data-check">当前检查通话数： {{ currentResult.allCheckedNum }}</div>
            <div class="data-check">当前疑似通话数： {{ currentResult.allSimilarNum }}</div>
            <h2 class="title">
              详情
            </h2>
            <div class="echarts">
            <IEcharts :option="reportOption" @click="selectRecordGroup"></IEcharts>
            </div>
          </Card>
          <Card v-if="showSecondChart">
            <template slot="title">
              <Icon type="person-stalker"></Icon>
              经销商： {{ currentDistributorName.name }}
              <Button type="primary" class="check-button" size="small" @click="backToReportFrom">返回</Button>
            </template>
            <div class="data-check">当前得分：{{ currentResult.score }}</div>
            <div class="data-check">当前检查通话数： {{ currentResult.allCheckedNum }}</div>
            <div class="data-check">当前疑似通话数： {{ currentResult.allSimilarNum }}</div>
            <h2 class="title">
              详情
              <Button type="primary" class="back-button" size="small" @click="backToFirstChart">返回</Button>
            </h2>
            <div class="echarts2">
              <IEcharts :option="recordOption" @click="selectRecord"></IEcharts>
            </div>
            <p>各通话与 {{ currentCall }} 的相似度:</p>
            <div class="singleCall" v-for="(record, index) of recordOption.series[0].data" :key="index">
              <span> {{ record.name }}: {{ '' }}</span>
            </div>
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
            v-model="addProjectDialog"
            title="项目销商"
            :loading="addDistributorLoading"
            @on-ok="addProject">
            <Input v-model="addProjectName">
              <span slot="prepend">项目名称</span>
            </Input>
          </Modal>
          <Modal
            v-model="voiceDataCheckDialog"
            title="检查"
            :loading="voiceDataCheckLoading"
            @on-ok="voiceDataCheck">
            <Input class="imput-small" v-model="newReportName">
              <span slot="prepend">报表名称</span>
            </Input>
            <Input class="imput-small" v-model="newVoiceDataPath">
              <span slot="prepend">语音路径</span>
            </Input>
            <Select v-model="channel" class="select-small" placeholder="声道">
              <Option v-for="item in channels" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="samplerate" class="select-small" placeholder="采样率">
              <Option v-for="item in samplerates" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="channelType" class="select-small" placeholder="声道类型">
              <Option v-for="item in channelTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="wavType" class="select-small" placeholder="语音格式">
              <Option v-for="item in wavTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Modal>
          <Modal
            v-model="deleteDistrubutorDialog"
            title="删除"
            :loading="voiceDataCheckLoading"
            @on-ok="deleteDistrubutor">
            是否删除该经销商？一经删除，即不可恢复。
          </Modal>
          <Modal
            v-model="deleteProjectDialog"
            title="删除"
            :loading="voiceDataCheckLoading"
            @on-ok="deleteProject">
            是否删除该项目？一经删除，即不可恢复。
          </Modal>
          <Modal
            v-model="deleteReportDialog"
            title="删除"
            :loading="voiceDataCheckLoading"
            @on-ok="deleteReport">
            是否删除该报表？一经删除，即不可恢复。
          </Modal>
        </div>
      </Col>
    </div>
    <!-- <div class="layout-copy">
      2017 &copy; shayumaoliang
    </div> -->
  </div>
</template>
<script>
  const qs = require('qs')
  // const echarts = require('echarts')
  export default {
    data () {
      return {
        reportOption: {
          backgroundColor: 'rgb(229, 236, 225)',
          animationDuration: 1500,
          draggable: false,
          series: [{
            data: [],
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 100
            },
            roam: 'scale',
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: 5,
                color: 'rgb(39, 99, 122)'
              }
            }
          }]
        },
        recordOption: {
          backgroundColor: 'rgb(229, 236, 225)',
          animationDuration: 1500,
          animationEasingUpdate: 'quinticInOut',
          draggable: false,
          series: [
            {
              type: 'graph',
              layout: 'force',
              force: {
                repulsion: [100, 500],
                edgeLength: [0, 100]
              },
              data: [],
              links: [],
              roam: 'scale',
              itemStyle: {
                normal: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(120, 36, 50, 0.5)',
                  shadowOffsetY: 5,
                  color: 'rgb(39, 99, 122)'
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
        },
        channel: null,
        channels: [
          {
            value: 0,
            label: '左声道'
          },
          {
            value: 1,
            label: '右声道'
          }
        ],
        samplerate: null,
        samplerates: [
          {
            value: 8000,
            label: '8000'
          },
          {
            value: 16000,
            label: '16000'
          }
        ],
        channelType: null,
        channelTypes: [
          {
            value: 0,
            label: 'dep'
          },
          {
            value: 1,
            label: 'mixed'
          }
        ],
        wavType: null,
        wavTypes: [
          {
            value: 0,
            label: 'wav'
          },
          {
            value: 1,
            label: 'mp3'
          },
          {
            value: 3,
            label: 'pcm'
          }
        ],
        score: 0,
        showAllProject: true,
        showSecondChart: false,
        newVoiceDataPath: null,
        newReportName: null,
        voiceDataCheckLoading: true,
        voiceDataCheckDialog: false,
        deleteDistrubutorDialog: false,
        deleteProjectDialog: false,
        deleteReportDialog: false,
        addDistributorName: null,
        addDistributorLoading: true,
        addDistributorDialog: false,
        showAllDistributors: false,
        showReportForm: false,
        showFirstChart: false,
        reportFormColumn: [
          {
            title: '报告名称',
            key: 'reportName'
          },
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
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteReportConfirm(params)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        reportFormData: [],
        allDistributors: [],
        allProjects: [],
        currentProjectName: {
          id: null,
          name: null
        },
        currentDistributorName: {
          id: null,
          name: null
        },
        projectIndex: null,
        addProjectName: null,
        addProjectDialog: false,
        row: {},
        totalResult: {},
        currentResult: {},
        currentCall: null
      }
    },
    methods: {
      addDistributorConfirm () {
        this.addDistributorName = null
        this.addDistributorDialog = true
      },
      addProjectConfirm () {
        this.addProjectName = null
        this.addProjectDialog = true
      },
      addDistributor () {
        setTimeout(async() => {
          try {
            const res = await this.$http({
              method: 'POST',
              url: this.$apiUrl + '/' + this.currentProjectName.name + '/createdealer',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              data: qs.stringify({
                dealer_name: this.addDistributorName
              })
            })
            if (res.data.code === 0) {
              this.getAllDistributors()
              this.addDistributorDialog = false
              this.$Message.success('添加成功')
            } else {

            }
          } catch (e) {
            console.log(e)
          }
        }, 1000)
      },
      addProject () {
        setTimeout(async() => {
          try {
            const res = await this.$http({
              method: 'POST',
              url: this.$apiUrl + '/createproject',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              data: qs.stringify({
                project_name: this.addProjectName
              })
            })
            if (res.data.code === 0) {
              this.getAllProjects()
              this.addProjectDialog = false
              this.$Message.success('添加成功')
            } else {
              this.$Message.error(res.data.msg)
            }
          } catch (e) {
            this.$Message.error('网络错误')
            this.addProjectDialog = false
            console.log(e)
          }
        }, 1000)
      },
      voiceDataCheckConfirm () {
        this.voiceDataCheckDialog = true
      },
      deleteDistrubutorConfirm () {
        this.deleteDistrubutorDialog = true
      },
      deleteProjectConfirm () {
        this.deleteProjectDialog = true
      },
      async getCheckedTotalResult () {
        try {
          const res = await this.$http({
            method: 'GET',
            url: this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/resultinfo'
          })
          if (res.data.code === 0) {
            const totalResult = {}
            totalResult['score'] = res.data.score
            totalResult['allSimilarNum'] = res.data.suspectstotal
            totalResult['allCheckedNum'] = res.data.wavtotal
            this.totalResult = totalResult
          } else {
            this.$Message.success(res.data.msg)
          }
        } catch (e) {
          this.$Message.error('发生错误，请查看日志')
          console.log(e)
        }
      },
      async getReport () {
        try {
          this.reportFormData = []
          const res = await this.$http({
            method: 'GET',
            url: this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/allreports'
          })
          if (res.data.code === 0) {
            const reports = res.data.reports
            for (let i = 0; i < reports.length; i++) {
              const report = {}
              report['reportName'] = reports[i].report_name
              report['checkedTime'] = reports[i].report_time
              report['checkProgress'] = reports[i].state
              report['checkNum'] = reports[i].check_num
              report['similarCall'] = reports[i].suspects
              this.reportFormData.push(report)
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        } catch (e) {
          this.$Message.error('发生错误，请查看日志')
          console.log(e)
        }
      },
      voiceDataCheck () {
        setTimeout(async() => {
          try {
            const res = await this.$http({
              method: 'POST',
              url: this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/createreport',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              data: qs.stringify({
                report_name: this.newReportName,
                wav_dir: this.newVoiceDataPath,
                channel: this.channel,
                samplerate: this.samplerate,
                chan_type: this.channelType,
                wav_type: this.wavType
              })
            })
            if (res.data.code === 0) {
              this.$Message.success('开始检查')
              this.voiceDataCheckDialog = false
              this.getReport()
            } else {
              this.$Message.error(res.data.msg)
              this.voiceDataCheckDialog = false
            }
          } catch (e) {
            this.voiceDataCheckDialog = false
            this.$Message.error('发生错误，请查看日志')
            console.log(e)
          }
        }, 1000)
      },
      deleteDistrubutor () {
        setTimeout(async() => {
          try {
            const res = await this.$http({
              method: 'GET',
              url: this.$apiUrl + '/' + this.currentProjectName.name + '/deletedealer?dealer_name=' + this.currentDistributorName.name
            })
            if (res.data.code === 0) {
              this.$Message.success('成功删除')
              this.deleteDistrubutorDialog = false
              this.getAllDistributors()
            } else {
              this.$Message.error(res.data.msg)
            }
          } catch (e) {
            this.$Message.error('发生错误，请查看日志')
            this.deleteDistrubutorDialog = false
            console.log(e)
          }
        }, 1000)
      },
      deleteReportConfirm (params) {
        this.row = params.row
        this.deleteReportDialog = true
      },
      deleteProject () {
        setTimeout(async() => {
          try {
            const res = await this.$http({
              method: 'GET',
              url: this.$apiUrl + '/deleteproject?project_name=' + this.currentProjectName.name
            })
            if (res.data.code === 0) {
              this.deleteProjectDialog = false
              this.$Message.success('成功删除')
              this.getAllProjects()
            } else {
              this.deleteProjectDialog = false
              this.$Message.error(res.data.msg)
            }
          } catch (e) {
            this.deleteProjectDialog = false
            this.$Message.error('发生错误，请查看日志')
            console.log(e)
          }
        }, 1000)
      },
      async deleteReport () {
        try {
          const res = await this.$http({
            method: 'GET',
            url: this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/deletereport?report_name=' + this.row.reportName
          })
          if (res.data.code === 0) {
            this.deleteReportDialog = false
            this.$Message.success('成功删除')
            this.getReport()
          } else {
            this.deleteReportDialog = false
            this.$Message.error(res.data.msg)
          }
        } catch (e) {
          this.deleteReportDialog = false
          this.$Message.error(e)
          console.log(e)
        }
      },
      selectDistributor (index) {
        this.showFirstChart = false
        this.showSecondChart = false
        this.showReportForm = true
        this.currentDistributorName['name'] = this.allDistributors[index].name
        this.currentDistributorName['id'] = index
        this.showAllDistributors = false
        this.getCheckedTotalResult()
        this.getReport()
      },
      toShowAllDistributors () {
        this.showAllDistributors = true
        this.showFirstChart = false
        this.showSecondChart = false
        this.showReportForm = false
        this.showAllProject = false
        this.currentDistributorName = {}
      },
      backToReportFrom () {
        this.showFirstChart = false
        this.showSecondChart = false
        this.showReportForm = true
      },
      async backToFirstChart () {
        await this.getAllSimilarCall()
        this.showFirstChart = true
        this.showSecondChart = false
      },
      exportReport () {
        this.$Message.success('导出成功')
      },
      async getAllSimilarCall () {
        try {
          this.reportOption.series[0].data = []
          const res = await this.$http({
            method: 'GET',
            url: this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/' + this.row.reportName + '/allsuspectset'
          })
          if (res.data.code === 0) {
            const allSimilarCall = res.data.suspectSets
            for (let i = 0; i < allSimilarCall.length; i++) {
              const similarCallGroup = {}
              similarCallGroup['name'] = '通话数：' + allSimilarCall[i].suspect_num
              similarCallGroup['value'] = allSimilarCall[i].suspect_num
              similarCallGroup['id'] = allSimilarCall[i].cluster_id
              similarCallGroup['symbolSize'] = allSimilarCall[i].suspect_num * 8
              similarCallGroup['similarCallGroup'] = allSimilarCall[i].suspects
              this.reportOption.series[0].data.push(similarCallGroup)
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        } catch (e) {
          this.$Message.error('发生错误，请查看日志')
          console.log(e)
        }
      },
      async getCurrentResult () {
        try {
          const res = await this.$http({
            method: 'GET',
            url: this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/' + this.row.reportName + '/resultinfo'
          })
          if (res.data.code === 0) {
            const currentResult = {}
            currentResult['score'] = res.data.score
            currentResult['allSimilarNum'] = res.data.suspectstotal
            currentResult['allCheckedNum'] = res.data.wavtotal
            this.currentResult = currentResult
          } else {
            this.$Message(res.data.msg)
          }
        } catch (e) {
          this.$Message.error('发生错误，请查看日志')
          console.log(e)
        }
      },
      async showReportFormDetail (index) {
        if (index.checkProgress === '完成') {
          this.row = index
          await this.getAllSimilarCall()
          await this.getCurrentResult()
          this.showReportForm = false
          this.showFirstChart = true
        } else {
          this.$Message.warning('语音检查未完成，无法查看结果')
        }
      },
      async getOneGroupRelation (id, name) {
        try {
          const res = await this.$http({
            method: 'GET',
            url: this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/' + this.row.reportName + '/' + '/suspectinfo?cluster_id=' + id + '&suspect_name=' + name
          })
          if (res.data.code === 0) {
            this.currentCall = name
            const relationInfo = res.data.suspectInfo.result
            this.recordOption.series[0].data = [
              {
                recordId: id,
                name: name,
                symbolSize: 50,
                itemStyle: {
                  normal: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(120, 36, 50, 0.5)',
                    shadowOffsetY: 5,
                    color: 'rgb(30, 36, 62)'
                  }
                }
              }
            ]
            this.recordOption.series[0].links = []
            for (let i = 0; i < relationInfo.length; i++) {
              const relation = {}
              const link = {}
              relation['recordId'] = id
              relation['name'] = relationInfo[i].spkid
              relation['symbolSize'] = 50
              link['source'] = name
              link['target'] = relationInfo[i].spkid
              link['value'] = Math.abs(relationInfo[i].length - 100)
              this.recordOption.series[0].data.push(relation)
              this.recordOption.series[0].links.push(link)
            }
            console.log(this.recordOption.series[0].data, this.recordOption.series[0].links)
          } else {
            this.$Message.error(res.data.msg)
          }
        } catch (e) {
          this.$Message.error('发生错误，请查看日志')
          console.log(e)
        }
      },
      async selectRecordGroup (event, instance, echarts) {
        await this.getOneGroupRelation(arguments[0].data.id, arguments[0].data.similarCallGroup[0])
        this.showSecondChart = true
        this.showFirstChart = false
      },
      selectRecord (event, instance, echarts) {
        this.getOneGroupRelation(arguments[0].data.recordId, arguments[0].data.name)
        console.log(arguments)
      },
      async getAllDistributors () {
        try {
          this.allDistributors = []
          const res = await this.$http({
            method: 'GET',
            url: this.$apiUrl + '/' + this.currentProjectName.name + '/alldealers'
          })
          if (res.data.code === 0) {
            const allDistributors = res.data.dealers
            for (let i = 0; i < allDistributors.length; i++) {
              const distributor = {}
              distributor['name'] = allDistributors[i]
              this.allDistributors.push(distributor)
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        } catch (e) {
          console.log(e)
        }
      },
      selectProject (name) {
        this.projectIndex = name
        this.showAllDistributors = true
        this.showFirstChart = false
        this.showSecondChart = false
        this.showReportForm = false
        this.showAllProject = false
        this.currentProjectName['name'] = this.allProjects[name].name
        this.currentProjectName['id'] = name
        this.currentDistributorName = {}
        this.getAllDistributors()
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
              project['id'] = allProjects[i].id
              project['name'] = allProjects[i].project_name
              project['dealers'] = allProjects[i].dealers
              this.allProjects.push(project)
            }
          }
        } catch (e) {
          // this.$message({
          //   type: 'error',
          //   showClose: true,
          //   message: e
          // })
          console.log(e)
        }
      }
    },
    mounted () {
      this.getAllProjects()
    }
  }
</script>
<style scoped>
  .layout{
      /* border: 1px solid #d7dde4; */
      /* background: #f5f7f9; */
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
  .delete-button{
    float: right;
    margin-right: 2%;
    margin-bottom: 20px;
  }
  .add-button {
    margin-left: 5px;
  }
  .back-button{
    margin-right: 20%;
    float: right;
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
  .nuv-menu{
    height: 10%;
  }
  .layout-assistant{
      width: 300px;
      margin: 0 auto;
      height: inherit;
  }
  .layout-content{
      min-height: 100%;
      margin: 15px;
      /* overflow: hidden; */
      background: #fff;
      border-radius: 4px;
  }
  .layout-content-main{
      padding: 10px;
      min-height: 100%;
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
    position: relative;
    margin-top: 5px;
  }
  .echarts2 {
    position: relative;
    width: 80%;
    height: 400px;
    margin-top: 5px;
  }
  .record-list {
    margin-left: 0;
    background-color: rgb(205, 208, 213);
    width: 60.8%;
  }
  .a-distributor{
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 20px;
  }
  .card{
    padding: 5px;
    padding-bottom: 10px;
  }
  .select-small {
    width: 48.5%;
    margin-top: 5px;
  }
  .imput-small {
    width: 97.5%;
    margin-top: 5px;
  }
  .singleCall {
    margin-bottom: 5px;
    margin-left: 60px;
  }
</style>

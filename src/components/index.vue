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
            <BreadcrumbItem a="/" @click="toShowAllDistributors" v-show="currentProjectName.name"> {{ currentProjectName.name }}</BreadcrumbItem>
            <BreadcrumbItem v-show="currentDistributorName.name"> {{ currentDistributorName.name }}</BreadcrumbItem>
            <BreadcrumbItem v-show="currentReportName.name"> {{ currentReportName.name }}</BreadcrumbItem>
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
              <Button type="error" class="check-button" size="small" @click="deleteDistrubutorConfirm">删除该经销商</Button>
              <Button type="primary" class="delete-button" size="small" @click="backToDistrubutorList">返回经销商列表</Button>
              <Button type="primary" class="delete-button" size="small" @click="voiceDataCheckConfirm">检查</Button>
              <!-- <Button type="primary" class="delete-button" size="small" @click="uploadConfirm">上传音频</Button> -->
            </template>
            <div class="data-check">得分：{{ totalResult.score }}</div>
            <!-- <Circle :percent="totalResult.score">
                <span style="font-size:24px">得分：{{ totalResult.score }}</span>
            </Circle> -->
            <div class="data-check">累计检查通话数：{{ totalResult.allCheckedNum }}</div>
            <div class="data-check">累计疑似通话：{{ totalResult.allSimilarNum }}</div>
            <h2 class="title">
              报表
            </h2>
            <span>*双击查看图表*</span>
            <Table height="450" :columns="reportFormColumn" :data="reportFormData" @on-row-dblclick="showReportFormDetail"></Table>
          </Card>
          <Card v-if="showFirstChart">
            <template slot="title">
              <Icon type="person-stalker"></Icon>
              经销商： {{ currentDistributorName.name }}
              <Button type="primary" class="check-button" size="small" @click="backToReportFrom">返回</Button>
              <!-- <Button type="primary" class="check-button" size="small" :herf="download">导出报表</Button> -->
              <a type="primary" class="check-button" size="small" :href="download">导出报表</a>
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
              <Button type="primary" class="check-button" size="small" @click="backToFirstChart">返回</Button>
            </template>
            <div class="data-check">当前得分：{{ currentResult.score }}</div>
            <div class="data-check">当前检查通话数： {{ currentResult.allCheckedNum }}</div>
            <div class="data-check">当前疑似通话数： {{ currentResult.allSimilarNum }}</div>
            <h2 class="title">
              详情
              <!-- <Button type="primary" class="back-button" size="small" @click="backToFirstChart">返回</Button> -->
            </h2>
            <div class="echarts2">
              <IEcharts :option="recordOption" @click="selectRecord"></IEcharts>
            </div>
            <br />
            <p>各通话与 {{ currentCall }} 的相似度:</p>
            <div class="singleCall" v-for="(record, index) of recordOption.series[0].links" :key="index">
              <span> {{ record.target }}: <Progress style="width: 100px;" :status="record.status" :hide-info="true" :stroke-width="5" :percent="Number(record.similarity.split('%')[0])"></Progress>{{ record.similarity }}</span>
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
          <div class="upload-div">
            <Modal
              class-name="upload-dialog"
              v-model="voiceDataCheckDialog"
              title="音频检查"
              :mask-closable="false"
              :closable="false"
              :scrollable="true"
              :loading="addDistributorLoading">
              <Form ref="newReport" :model="newReport" :rules="newReportRule" :label-width="100">
                <FormItem  class="imput-small" label="报表名称" prop="newReportName">
                  <Input :disabled="inputDisabled" v-model="newReport.newReportName">
                  </Input>
                </FormItem>
                <FormItem class="imput-small" label="是否要上传音频" prop="voiceDataStatus">
                  <RadioGroup type="button" @on-change="uploadChange" v-model="newReport.voiceDataStatus">
                    <Radio label="1">是</Radio>
                    <Radio label="0">否</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem class="imput-path" label="语音路径" prop="newVoiceDataPath" v-if="newReport.voiceDataStatus === '0'">
                  <Input v-model="newReport.newVoiceDataPath"></Input>
                </FormItem>
                <FormItem class="imput-path" label="上传音频" v-if="newReport.newReportName && newReport.voiceDataStatus === '1'">
                  <Upload
                    multiple
                    :on-success="uploadSuccess"
                    :before-upload="beforeUpload"
                    :on-progress="uploading"
                    :format="['mp3','wav','pcm']"
                    :on-format-error="uploadFormatError"
                    :show-upload-list="false"
                    :action="uploadURL">
                    <Button type="ghost" icon="ios-cloud-upload-outline">请选择要上传的音频</Button>
                    {{ fileName }}<Progress v-if="uploadPercent" :percent="uploadPercent" :stroke-width="5"></Progress>
                  </Upload>
                </FormItem>
                <FormItem class="select-small" label="选择声道" prop="channel">
                  <Select v-model="newReport.channel" placeholder="声道">
                    <Option value="0">左声道</Option>
                    <Option value="1">右声道</Option>
                  </Select>
                </FormItem>
                <FormItem class="select-small" label="选择采样率" prop="samplerate">
                  <Select v-model="newReport.samplerate" placeholder="采样率">
                    <Option value="8000">8000</Option>
                    <Option value="16000">16000</Option>
                  </Select>
                </FormItem>
                <FormItem class="select-small" label="选择声道类型" prop="channelType">
                  <Select v-model="newReport.channelType" placeholder="声道类型">
                    <Option value="0">dep</Option>
                    <Option value="1">mixed</Option>
                  </Select>
                </FormItem>
                <FormItem class="select-small" label="选择音频格式" prop="wavType">
                  <Select v-model="newReport.wavType" placeholder="语音格式">
                    <Option value="0">wav</Option>
                    <Option value="1">mp3</Option>
                    <Option value="2">pcm</Option>
                  </Select>
                </FormItem>
                <FormItem label="选择模式" prop="checkMode">
                  <RadioGroup v-model="newReport.checkMode" type="button">
                    <Radio label="0">宽松</Radio>
                    <Radio label="1">一般</Radio>
                    <Radio label="2">严格</Radio>
                  </RadioGroup>
                </FormItem>
              </Form>
              <div slot="footer">
                <Button type="error" @click="voiceDataCheckCancel('newReport')">取消</Button>
                <Button type="success" @click="voiceDataCheck('newReport')">开始检查</Button>
              </div>
            </Modal>
          </div>
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
  </div>
</template>
<script>
  const qs = require('qs')
  // const echarts = require('echarts')
  export default {
    data () {
      return {
        fileName: null,
        uploadPercent: null,
        voiceDataStatus: '0',
        uploadURL: null,
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
        newReport: {
          newReportName: null,
          voiceDataStatus: '0',
          newVoiceDataPath: null,
          channel: null,
          samplerate: null,
          channelType: null,
          wavType: null,
          checkMode: '0'
        },
        newReportRule: {
          newReportName: [
            { required: true, message: '请先填写报表名称', trigger: 'blur' }
          ],
          newVoiceDataPath: [
            { required: true, message: '请填写音频文件路径', trigger: 'blur' }
          ],
          channel: [
            { required: true, message: '请选择声道', trigger: 'blur' }
          ],
          samplerate: [
            { required: true, message: '请选择采样率', trigger: 'blur' }
          ],
          channelType: [
            { required: true, message: '请选择声道类型', trigger: 'blur' }
          ],
          wavType: [
            { required: true, message: '请选择音频格式', trigger: 'blur' }
          ]
        },
        score: 0,
        inputDisabled: false,
        showAllProject: true,
        showSecondChart: false,
        newVoiceDataPath: null,
        newReportName: null,
        voiceDataCheckLoading: true,
        voiceDataCheckDialog: false,
        uploadDialog: false,
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
            title: '单次检查通话数',
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
        currentReportName: {
          id: null,
          name: null
        },
        projectIndex: null,
        addProjectName: null,
        addProjectDialog: false,
        row: {},
        totalResult: {},
        currentResult: {},
        currentCall: null,
        download: null,
        file: [],
        loadingStatus: false
      }
    },
    methods: {
      beforeUpload (file) {
        // console.log(file)
      },
      uploadFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确'
        })
      },
      uploadSuccess () {

      },
      uploadChange (value) {
        if (value === '1') {
          const reportName = this.newReport.newReportName.replace(/^\s+|\s+$/g, '')
          if (reportName) {
            this.inputDisabled = true
            this.uploadURL = this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/' + reportName + '/upload'
          } else {
            this.newReport.voiceDataStatus = '0'
            this.$Message.warning('请先填写报表名称')
          }
        } else {
          this.inputDisabled = false
        }
      },
      uploading (file, event, fileList) {
        // console.log(file)
        // console.log(event)
        // console.log(fileList)
        this.fileName = event.name
        this.uploadPercent = file.percent
      },
      StartPpload () {
        this.loadingStatus = true
        setTimeout(() => {
          this.file = null
          this.loadingStatus = false
          this.$Message.success('上传成功')
        }, 1500)
      },
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
      voiceDataCheckConfirm (name) {
        this.voiceDataCheckDialog = true
      },
      uploadConfirm () {
        this.uploadDialog = true
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
      voiceDataCheckCancel (name) {
        this.inputDisabled = false
        this.voiceDataCheckDialog = false
        this.$refs[name].resetFields()
      },
      voiceDataCheck (name) {
        this.$refs[name].validate(async (valid) => {
          if (valid) {
            try {
              let isUpload
              let voiceDir
              const reportName = this.newReport.newReportName.replace(/^\s+|\s+$/g, '')
              if (this.newReport.voiceDataStatus === '1') {
                isUpload = 1
                voiceDir = this.currentProjectName.name + '/' + this.currentDistributorName.name + '/' + reportName
              } else {
                isUpload = 0
                voiceDir = this.newReport.newVoiceDataPath
              }
              const res = await this.$http({
                method: 'POST',
                url: this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/createreport',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({
                  report_name: reportName,
                  wav_dir: voiceDir,
                  channel: this.newReport.channel,
                  samplerate: this.newReport.samplerate,
                  chan_type: this.newReport.channelType,
                  wav_type: this.newReport.wavType,
                  threshold: this.newReport.checkMode,
                  isupload: isUpload
                })
              })
              if (res.data.code === 0) {
                this.$Message.success('开始检查')
                this.voiceDataCheckDialog = false
                this.getReport()
              } else {
                this.addDistributorLoading = false
                this.$Message.error(res.data.msg)
              }
            } catch (e) {
              this.voiceDataCheckDialog = false
              this.$Message.error('发生错误，请查看日志')
              console.log(e)
            }
          } else {
            this.$Message.error('请将参数填写完整!')
            this.voiceDataCheckDialog = true
            this.addDistributorLoading = false
          }
        })
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
              this.showReportForm = false
              this.showAllDistributors = true
              this.currentDistributorName.name = null
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
              this.showAllDistributors = false
              this.currentProjectName.name = null
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
        this.currentReportName.name = null
      },
      backToDistrubutorList () {
        this.showReportForm = false
        this.showAllDistributors = true
        this.currentDistributorName.name = null
      },
      async backToFirstChart () {
        await this.getAllSimilarCall()
        this.showFirstChart = true
        this.showSecondChart = false
      },
      async exportReport () {
        try {
          const res = await this.$http({
            method: 'GET',
            url: this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/' + this.row.reportName + '/download'
          })
          if (res.data.code === 0) {
            this.$Message.success('导出成功')
          }
        } catch (e) {
          this.$Message.error('发生错误，请查看日志')
          console.log(e)
        }
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
          this.currentReportName.name = index.reportName
          await this.getAllSimilarCall()
          await this.getCurrentResult()
          this.showReportForm = false
          this.showFirstChart = true
          this.download = this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/' + this.row.reportName + '/download'
        } else {
          this.$Message.warning('语音检查未完成，无法查看结果')
        }
      },
      async getOneGroupRelation (id, name) {
        try {
          const res = await this.$http({
            method: 'GET',
            url: this.$apiUrl + '/' + this.currentProjectName.name + '/' + this.currentDistributorName.name + '/' + this.row.reportName + '/suspectinfo?cluster_id=' + id + '&suspect_name=' + name
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
              link['similarity'] = relationInfo[i].similarity.toFixed(2) + '%'
              if (relationInfo[i].similarity < 50) {
                link['status'] = 'success'
              } else {
                if (relationInfo[i].similarity < 80) {
                  link['status'] = 'normal'
                } else {
                  if (relationInfo[i].similarity < 100) {
                    link['status'] = 'wrong'
                  }
                }
              }
              link['value'] = relationInfo[i].length * 100
              this.recordOption.series[0].data.push(relation)
              this.recordOption.series[0].links.push(link)
            }
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
    width: 80%;
    margin-top: 1px;
  }
  .imput-path {
    width: 80%;
    margin-top: 5px;
  }
  .imput-small {
    width: 80%;
    margin-top: 5px;
    /* float: left; */
    margin-top: 5px;
    /* display: inline; */
  }
  .singleCall {
    margin-bottom: 5px;
    margin-top: 5px;
    margin-left: 60px;
  }
  .upload-dialog {
    max-height: 500px;
  }
  .upload-div {
    max-height: 500px;
    overflow: visible;
  }
</style>

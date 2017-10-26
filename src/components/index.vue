<template>
  <div class="layout">
    <Menu mode="horizontal" theme="light" active-name="1">
      <!-- <div class="layout-logo"></div> -->
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
                    <Icon type="person-stalker"></Icon>
                    所有经销商名字
                    <Button type="primary" class="check-button" size="small">添加经销商</Button>
                  </template>
                  <div v-for="(distributor, index) of allDistributors" :key="index">
                      <a class="a-distributor" @click="selectDistributor(index)"> {{ distributor.name }} </a>
                  </div>
                </Card>
                <Card v-if="showReportForm">
                  <template slot="title">
                    <Icon type="person-stalker"></Icon>
                    经销商名字
                    <Button type="primary" class="check-button" size="small">检查</Button>
                  </template>
                  <div class="data-check">得分：{{ '九十分' }}</div>
                  <div class="data-check">累计检查通话数 {{ '5000' }}</div>
                  <div class="data-check">累计疑似通话 {{ '20' }}</div>
                  <h2 class="title">
                    报表
                  </h2>
                  <Table :columns="reportFormColumn" :data="reportFormData" @on-row-click="showReportFormDetail"></Table>
                  <!-- <IEcharts :option="cpuStatus" class="echarts"></IEcharts> -->
                </Card>
                <Card v-if="showFirstChart">
                  <template slot="title">
                    <Icon type="person-stalker"></Icon>
                    经销商名字
                    <Button type="primary" class="check-button" size="small" @click="backToReportFrom">返回</Button>
                  </template>
                  <div class="data-check">得分：{{ '九十分' }}</div>
                  <div class="data-check">累计检查通话数 {{ '5000' }}</div>
                  <div class="data-check">累计疑似通话 {{ '20' }}</div>
                  <h2 class="title">
                    详情
                  </h2>
                    这里是个图表
                </Card>
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
  export default {
    data () {
      return {
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
        cpuStatus: {
          title: {
            show: false
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {d}%'
          },
          series: [
            {
              name: 'CPU',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: true,
              label: {
                normal: {
                  show: true,
                  position: 'inner'
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: [
                { value: null, name: '已使用' },
                { value: null, name: '未使用' }

              ]
            }
          ]
        }
      }
    },
    methods: {
      selectDistributor (index) {
        this.showReportForm = true
        console.log(index)
      },
      backToReportFrom () {
        this.showFirstChart = false
        this.showReportForm = true
      },
      showReportFormDetail (index) {
        this.showReportForm = false
        this.showFirstChart = true
        console.log(index)
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
      min-height: 100%;
      box-sizing: border-box;
      height: 100%;
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
  .layout-nav{
      width: 420px;
      margin: 0 auto;
  }
  .layout-assistant{
      width: 300px;
      margin: 0 auto;
      height: inherit;
  }
  .layout-content{
      height: 80%;
      margin: 15px;
      overflow: hidden;
      background: #fff;
      border-radius: 4px;
  }
  .layout-content-main{
      padding: 10px;
  }
  .layout-copy{
      text-align: center;
      padding: 10px 0 5px;
      color: #9ea7b4;
  }
  .echarts {
    float: left;
    margin-right: 0;
    margin-left: 0;
    width: 20%;
    height: 160px;
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

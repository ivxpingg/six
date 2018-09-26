package com.ikey.springbootmodule.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.IdGen;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.AuditProcess;
import com.ikey.springbootmodule.entity.Dict;
import com.ikey.springbootmodule.entity.ProcessStep;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.AuditProcessService;
import com.ikey.springbootmodule.service.ProcessStepService;
import com.ikey.springbootmodule.util.UserUtil;
import oracle.jdbc.proxy.annotation.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

@RestController
@RequestMapping("/processStep")
public class ProcessStepController {

    @Autowired
    private ProcessStepService processStepService;

    /**
     * 列表
     * @param request
     * @param response
     * @return
     */
   // @RequiresPermissions("sys:dict:view")
    @PostMapping(value = {"list", ""})
    public String list(@RequestBody(required=false) Page<ProcessStep> page, HttpServletRequest request, HttpServletResponse response) {
        Map<String,Object> map = new HashMap<String, Object>();
        if(page==null){
            page = new Page<ProcessStep>();
        }
        EntityWrapper ew=new EntityWrapper();
        if(page.getCondition() != null){
            ew.orderBy("STEP",true);
        }
        Page<Dict> pageObj = processStepService.selectPage(page, ew);
        map.put("page", pageObj);
        return JsonUtil.getSuccJson(map);
    }


    /**
     * 添加
     * @param processStep
     * @return
     */
    //@RequiresPermissions("sys:dict:edit")
    @PostMapping(value = "add")
    public String add(@RequestBody ProcessStep processStep) throws GlobalException {
        Integer step = processStepService.getMaxStep(processStep.getAuditProcessId());
        processStep.setProcessStepId(IdGen.uuid());
        processStep.setStep(Short.parseShort((step+1)+""));
        boolean result = processStepService.saveProcessStep(processStep);
        if(!result){
            throw new GlobalException(ExceptionType.E0002);
        }
        return JsonUtil.getSuccJson(processStep);
    }


    /**
     * 删除流程步骤
     * @param id
     * @return
     */
    @GetMapping(value = "delete")
    public String delete(@RequestParam(required=true) String id) {
        boolean result = processStepService.deleteById(id);
        if(!result){
            throw new GlobalException(ExceptionType.E0004);
        }
        return JsonUtil.getSuccJson(null);
    }


    /***
     * 修改流程步骤
     * @param processStep
     * @return
     */
    @PostMapping(value = "update")
    public String update(@RequestBody ProcessStep processStep) {
        boolean result = processStep.updateById();
        if(!result){
            throw new GlobalException(ExceptionType.E0003);
        }
        return JsonUtil.getSuccJson(processStep);
    }

    /**
     * 上移下移
     * @param processStepIds
     * @return
     */
    @GetMapping(value = "move")
    public String move(@RequestParam String processStepIds) {
        String[] array = processStepIds.split(",");
        if(array.length!=2){
            throw new GlobalException(ExceptionType.E0003);
        }
        EntityWrapper ew=new EntityWrapper();
        ew.or("PROCESS_STEP_ID={0} or PROCESS_STEP_ID={1}",array[0],array[1]);
        List<ProcessStep> processSteps = processStepService.selectList(ew);
        ProcessStep firstProcessStep = processSteps.get(0);
        ProcessStep secondProcessStep = processSteps.get(1);
        Short firstStep = firstProcessStep.getStep();
        Short secondStep = secondProcessStep.getStep();
        firstProcessStep.setStep(secondStep);
        secondProcessStep.setStep(firstStep);
        List<ProcessStep> list = new ArrayList<ProcessStep>();
        list.add(firstProcessStep);
        list.add(secondProcessStep);
        boolean b = processStepService.updateBatchById(list);
        if(!b){
            throw new GlobalException(ExceptionType.E0003);
        }
        return JsonUtil.getSuccJson();
    }


}

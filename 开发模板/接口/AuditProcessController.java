package com.ikey.springbootmodule.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.AuditProcess;
import com.ikey.springbootmodule.entity.Dict;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.AuditProcessService;
import com.ikey.springbootmodule.util.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @author laughing
 * @date 2018-09-25 22:44
 * @description 审核方案
 */
@RestController
@RequestMapping("/auditProcess")
public class AuditProcessController {

    @Autowired
    private AuditProcessService auditProcessService;

    /**
     * 列表
     * @param request
     * @param response
     * @return
     */
   // @RequiresPermissions("sys:dict:view")
    @RequestMapping(value = {"list", ""})
    public String list(@RequestBody(required=false) Page<AuditProcess> page, HttpServletRequest request, HttpServletResponse response) {
        Map<String,Object> map = new HashMap<String, Object>();
        if(page==null){
            page = new Page<AuditProcess>();
        }
        EntityWrapper ew=new EntityWrapper();
        if(page.getCondition() != null){
            ew.like("name",page.getCondition().get("name").toString());
        }
        ew.orderBy("operate_time",true);
        Page<Dict> pageObj = auditProcessService.selectPage(page, ew);
        map.put("page", pageObj);
        return JsonUtil.getSuccJson(map);
    }


    /**
     * 添加
     * @param auditProcess
     * @return
     */
    //@RequiresPermissions("sys:dict:edit")
    @PostMapping(value = "add")
    public String add(@RequestBody AuditProcess auditProcess) throws GlobalException {
        auditProcess.setOperateTime(new Date());
        auditProcess.setOperator(UserUtil.getShiroUser().getName());
        boolean result = auditProcessService.insert(auditProcess);
        if(!result){
            throw new GlobalException(ExceptionType.E0002);
        }
        return JsonUtil.getSuccJson(auditProcess);
    }


    /**
     * 修改审核方案
     * @param auditProcess
     * @return
     */
    @PostMapping(value = "update")
    public String update(@RequestBody AuditProcess auditProcess){
        boolean result = auditProcess.updateById();
        if(!result){
            throw new GlobalException(ExceptionType.E0003);
        }
        return JsonUtil.getSuccJson(auditProcess);
    }

    /**
     * 修改审核方案
     * @param auditProcessId
     * @return
     */
    @PostMapping(value = "query")
    public String update(@RequestParam(name = "auditProcessId") String auditProcessId){
        return JsonUtil.getSuccJson(auditProcessService.selectById(auditProcessId));
    }


    /**
     * 删除
     * @param auditProcessId
     * @return
     */
    //@RequiresPermissions("sys:dict:edit")
    @RequestMapping(value = "delete")
    public String delete(@RequestParam(name = "auditProcessId") String auditProcessId) {
        boolean result = auditProcessService.deleteAuditProcess(auditProcessId);
        if(!result){
            throw new GlobalException(ExceptionType.E0004);
        }
        return JsonUtil.getSuccJson(null);
    }



}

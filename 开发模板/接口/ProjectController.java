package com.ikey.springbootmodule.controller;

import com.baomidou.mybatisplus.plugins.Page;
import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.Project;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Auther: laughing
 * @Date: 2018-9-12 14:05
 * @Description:  项目
 */
@RestController
@RequestMapping("/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    /**
     * 项目列表
     *
     */
    @PostMapping
    public String list(Page<Map<String,Object>> page){
        if(page==null){
            page = new Page<Map<String,Object>>();
        }
        Page<Map<String,Object>> pageObj = projectService.projectPage(page);
        return JsonUtil.getSuccJson(pageObj);
    }


    /**
     * 项目登记
     * @param project
     * @return
     */
    @PostMapping(value = "add")
    public String add(@RequestBody Project project){
        boolean result = projectService.insert(project);
        if (!result){
            throw new GlobalException(ExceptionType.E0002);
        }
        return JsonUtil.getSuccJson(project);
    }


    /**
     *项目修改
     */


    /**
     * 项目查看
     * @param projectId
     * @return
     */
    @GetMapping(value = "query")
    public String query(@RequestParam String projectId){
       Map<String,Object> map = projectService.query(projectId);
       return JsonUtil.getSuccJson(map);
    }


    //项目材料列表 TODO


    //参建单位列表 TODO


    //添加参建单位 TODO

    //编辑参建人员 TODO


    //删除参建单位 TODO


}
